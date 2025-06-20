var SHEET_NAME = 'Deals';
var ALERT_THRESHOLD = 7;
var COLUMNS = {
  INDEX: 1,
  NAME: 2,
  URL: 3,
  PURCHASE_DATE: 4,
  STATUS: 5,
  TIMESTAMP: 6,
  DAYS_LEFT: 7
};

function getSheet() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) throw new Error('Sheet not found: ' + SHEET_NAME);
  return sheet;
}

function getSheetData() {
  var sheet = getSheet();
  var lastRow = sheet.getLastRow();
  if (lastRow < 2) return [];
  var data = sheet.getRange(2, 1, lastRow - 1, COLUMNS.DAYS_LEFT).getValues();
  var rows = [];
  for (var i = 0; i < data.length; i++) {
    var row = data[i];
    if (!row[COLUMNS.INDEX - 1]) continue;
    rows.push({
      rowIndex: i + 2,
      index: row[COLUMNS.INDEX - 1],
      name: row[COLUMNS.NAME - 1],
      url: row[COLUMNS.URL - 1],
      purchaseDate: row[COLUMNS.PURCHASE_DATE - 1]
    });
  }
  return rows;
}

function updateStatus(rowIndex, status) {
  var sheet = getSheet();
  sheet.getRange(rowIndex, COLUMNS.STATUS).setValue(status);
  sheet.getRange(rowIndex, COLUMNS.TIMESTAMP)
       .setValue(new Date())
       .setNumberFormat('yyyy-MM-dd HH:mm:ss');
}

function updateDaysLeft(rowIndex, daysLeft) {
  var sheet = getSheet();
  var cell = sheet.getRange(rowIndex, COLUMNS.DAYS_LEFT);
  cell.setValue(daysLeft);
  cell.clearBackground();
  if (typeof daysLeft === 'number' && daysLeft <= ALERT_THRESHOLD) {
    cell.setBackground('#f4c7c3');
  }
}

function hideRows(rowsToHide) {
  if (!rowsToHide || rowsToHide.length === 0) return;
  var sheet = getSheet();
  // Remove duplicates and sort
  var rows = rowsToHide.filter(function(r, i, a) {
    return a.indexOf(r) === i;
  }).sort(function(a, b) {
    return a - b;
  });
  var start = rows[0];
  var prev = start;
  var count = 1;
  for (var i = 1; i < rows.length; i++) {
    var curr = rows[i];
    if (curr === prev + 1) {
      count++;
      prev = curr;
    } else {
      sheet.hideRows(start, count);
      start = curr;
      prev = curr;
      count = 1;
    }
  }
  sheet.hideRows(start, count);
}


function setHeaderStyle() {
  var sheet = getSheet();
  var lastCol = sheet.getLastColumn();
  sheet.setRowHeight(1, 60);
  sheet.getRange(1, 1, 1, lastCol)
       .setBackground('#333333')
       .setFontColor('#ffffff')
       .setFontWeight('bold');
}

function applyFancySheetStyles() {
  var sheet = getSheet();
  var lastRow = sheet.getLastRow();
  var lastCol = sheet.getLastColumn();
  if (lastRow > 0) {
    sheet.setRowHeights(1, lastRow, 60);
  }
  setHeaderStyle();
  if (lastRow > 1 && lastCol > 0) {
    var range = sheet.getRange(2, 1, lastRow - 1, lastCol);
    var colors = [];
    for (var r = 0; r < lastRow - 1; r++) {
      var rowColor = (r % 2 === 0) ? '#f6f6ff' : '#ffffff';
      var row = [];
      for (var c = 0; c < lastCol; c++) {
        row.push(rowColor);
      }
      colors.push(row);
    }
    range.setBackgrounds(colors);
  }
}

var sheetReadWriteFormatter = {
  getSheet: getSheet,
  getSheetData: getSheetData,
  updateStatus: updateStatus,
  updateDaysLeft: updateDaysLeft,
  hideRows: hideRows,
  setHeaderStyle: setHeaderStyle,
  applyFancySheetStyles: applyFancySheetStyles
};
