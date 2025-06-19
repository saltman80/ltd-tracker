function formatDateDifference(date1, date2) {
  /**
   * Calculates the difference in whole days between two Date objects.
   * Uses Math.floor, so it truncates fractional days.
   * Negative values are returned if date2 is before date1.
   *
   * @param {Date} date1 - The earlier date.
   * @param {Date} date2 - The later date.
   * @returns {number} Number of full days between date1 and date2.
   */
  if (!(date1 instanceof Date) || !(date2 instanceof Date)) {
    throw new Error('Both arguments must be Date objects');
  }
  var msPerDay = 1000 * 60 * 60 * 24;
  return Math.floor((date2.getTime() - date1.getTime()) / msPerDay);
}

function log(msg) {
  Logger.log(msg);
}

/**
 * Converts a 1-based column index to its A1-style column letter.
 *
 * @param {number} column - The 1-based column index.
 * @returns {string} The corresponding column letter(s).
 */
function columnToLetter(column) {
  var letter = '';
  while (column > 0) {
    var remainder = (column - 1) % 26;
    letter = String.fromCharCode(65 + remainder) + letter;
    column = Math.floor((column - 1) / 26);
  }
  return letter;
}

function logDateDifferencesInRange() {
  var sheet = SpreadsheetApp.getActiveSheet();
  var ui = SpreadsheetApp.getUi();
  var range = sheet.getActiveRange();
  if (!range) {
    ui.alert('No range selected', 'Please select one or more cells and try again.', ui.ButtonSet.OK);
    return;
  }
  var values = range.getValues();
  if (values.length === 0 || values[0].length === 0) {
    ui.alert('Empty selection', 'Selected range contains no cells.', ui.ButtonSet.OK);
    return;
  }
  var now = new Date();
  var baseRow = range.getRow();
  var baseCol = range.getColumn();
  for (var i = 0; i < values.length; i++) {
    for (var j = 0; j < values[i].length; j++) {
      var cellValue = values[i][j];
      if (cellValue instanceof Date) {
        var diff = formatDateDifference(cellValue, now);
        var row = baseRow + i;
        var col = baseCol + j;
        var cellA1 = columnToLetter(col) + row;
        log(cellA1 + ': ' + diff + ' days');
      }
    }
  }
}
