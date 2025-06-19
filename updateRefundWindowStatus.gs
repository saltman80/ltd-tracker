var sheetService = sheetReadWriteFormatter;
var notificationService = gmailAlertDispatcher;
var formatDateDifference = dateDiffRangeLogger.formatDateDifference;
var { REFUND_PERIOD_DAYS, REFUND_ALERT_THRESHOLD_DAYS, EMAIL_ON_ALERT } = APP_CONFIG;

// provide batch methods on sheetService to avoid undefined errors
sheetService.batchUpdateDaysLeft = function(updates) {
  updates.forEach(({ rowIndex, daysLeft }) => {
    sheetService.updateDaysLeft(rowIndex, daysLeft);
  });
};
sheetService.batchUpdateRefundAlertSent = function(rowIndexes) {
  rowIndexes.forEach(rowIndex => {
    // assumes updateStatus can mark the refundAlertSent flag; adjust column/key as needed
    sheetService.updateStatus(rowIndex, 'refundAlertSent', true);
  });
};

function checkRefundWindow() {
  var deals = sheetService.getSheetData();
  var today = new Date();
  var daysLeftUpdates = [];
  var alertSentUpdates = [];

  deals.forEach(function(row) {
    try {
      var purchaseDate = row.purchaseDate;
      if (!(purchaseDate instanceof Date)) {
        purchaseDate = new Date(purchaseDate);
        if (isNaN(purchaseDate)) {
          Logger.log('Invalid purchaseDate for row ' + row.rowIndex + ': ' + row.purchaseDate);
          return;
        }
      }
      var daysUsed = formatDateDifference(purchaseDate, today);
      var daysLeft = REFUND_PERIOD_DAYS - daysUsed;
      daysLeftUpdates.push({ rowIndex: row.rowIndex, daysLeft: daysLeft });

      var withinAlertWindow = daysLeft <= REFUND_ALERT_THRESHOLD_DAYS && daysLeft >= 0;
      var alreadyAlerted = Boolean(row.refundAlertSent);
      if (EMAIL_ON_ALERT && withinAlertWindow && !alreadyAlerted) {
        notificationService.sendEmailAlert(Object.assign({}, row, { daysLeft: daysLeft }), 'refund');
        alertSentUpdates.push(row.rowIndex);
      }
    } catch (error) {
      Logger.log('Error processing refund window for row ' + row.rowIndex + ': ' + error);
    }
  });

  if (daysLeftUpdates.length) {
    sheetService.batchUpdateDaysLeft(daysLeftUpdates);
  }
  if (alertSentUpdates.length) {
    sheetService.batchUpdateRefundAlertSent(alertSentUpdates);
  }
}