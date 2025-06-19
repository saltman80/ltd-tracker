var EMAIL_ON_ALERT = true;

var sheetService = (function() {
  var sheet, urlCol, statusCol;
  
  function init() {
    if (sheet) return;
    sheet = SpreadsheetApp.getActive().getSheetByName('Deals');
    var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    urlCol = headers.indexOf('URL') + 1;
    statusCol = headers.indexOf('Status') + 1;
  }
  
  function getSheetData() {
    init();
    var lastRow = sheet.getLastRow();
    if (lastRow < 2) return [];
    var urlValues = sheet.getRange(2, urlCol, lastRow - 1, 1).getValues();
    var rows = [];
    for (var i = 0; i < urlValues.length; i++) {
      var raw = urlValues[i][0];
      var url = raw ? String(raw).trim() : '';
      if (url) {
        rows.push({ row: i + 2, url: url });
      }
    }
    return rows;
  }
  
  function updateStatuses(updates) {
    init();
    var lastRow = sheet.getLastRow();
    if (lastRow < 2) return;
    var numRows = lastRow - 1;
    var range = sheet.getRange(2, statusCol, numRows, 1);
    var existing = range.getValues(); // 2D array [ [status], ... ]
    updates.forEach(function(u) {
      var idx = u.row - 2;
      if (idx >= 0 && idx < existing.length) {
        existing[idx][0] = u.status;
      }
    });
    range.setValues(existing);
  }
  
  return {
    getSheetData: getSheetData,
    updateStatuses: updateStatuses
  };
})();

var notificationService = (function() {
  function sendEmailAlertBatch(deals, reason) {
    if (!deals || deals.length === 0) return;
    var user = Session.getEffectiveUser().getEmail();
    var subject = 'LTD Tracker Alert: ' + deals.length + ' deal' + (deals.length > 1 ? 's' : '') + ' ' + reason.toUpperCase();
    var body = 'The following deal URL' + (deals.length > 1 ? 's are' : ' is') + ' ' + reason + ':\n\n';
    deals.forEach(function(d) {
      body += d.url + '\n';
    });
    MailApp.sendEmail(user, subject, body);
  }
  
  return {
    sendEmailAlertBatch: sendEmailAlertBatch
  };
})();

function checkAllUrls() {
  var deals = sheetService.getSheetData();
  if (deals.length === 0) return;
  
  var requests = deals.map(function(d) {
    return {
      url: d.url,
      muteHttpExceptions: true,
      followRedirects: true
    };
  });
  
  var responses;
  try {
    responses = UrlFetchApp.fetchAll(requests);
  } catch (e) {
    Logger.log('fetchAll error: ' + e);
    // Fallback to sequential fetch
    responses = deals.map(function(d) {
      try {
        return UrlFetchApp.fetch(d.url, { muteHttpExceptions: true, followRedirects: true });
      } catch (err) {
        return null;
      }
    });
  }
  
  var updates = [];
  var downed = [];
  
  for (var i = 0; i < deals.length; i++) {
    var deal = deals[i];
    var resp = responses[i];
    var status;
    if (resp && typeof resp.getResponseCode === 'function') {
      var code = resp.getResponseCode();
      status = code === 200 ? '?' : '?';
      if (status === '?') {
        downed.push(deal);
      }
    } else {
      status = '??';
    }
    updates.push({ row: deal.row, status: status });
  }
  
  sheetService.updateStatuses(updates);
  
  if (EMAIL_ON_ALERT && downed.length > 0) {
    notificationService.sendEmailAlertBatch(downed, 'down');
  }
}