const REFUND_CHECK_HANDLER = 'checkRefundWindow';
const REFUND_CHECK_HOUR = 8;
const URL_CHECK_HANDLER = 'checkAllUrls';
const URL_CHECK_INTERVAL_HOURS = 1;

/**
 * Deletes any existing time-driven triggers for the refund status check.
 */
function deleteRefundCheckTriggers() {
  const handlerName = REFUND_CHECK_HANDLER;
  const triggers = ScriptApp.getProjectTriggers()
    .filter(trigger => trigger.getHandlerFunction() === handlerName);
  triggers.forEach(trigger => {
    try {
      ScriptApp.deleteTrigger(trigger);
    } catch (e) {
      Logger.log('Failed to delete trigger ID ' + (trigger.getUniqueId ? trigger.getUniqueId() : '[unknown]') + ': ' + e.toString());
    }
  });
}

/**
 * Creates a daily time-based trigger for the refund status check at the configured hour.
 * Any existing refund-check triggers are removed first.
 */
function createRefundCheckTrigger() {
  deleteRefundCheckTriggers();
  try {
    ScriptApp.newTrigger(REFUND_CHECK_HANDLER)
      .timeBased()
      .everyDays(1)
      .atHour(REFUND_CHECK_HOUR)
      .create();
  } catch (e) {
    Logger.log('Failed to create refund check trigger: ' + e.toString());
  }
}

/**
 * Ensures that a daily refund status check trigger exists.
 * Creates one if none is found.
 */
function restoreRefundCheckTrigger() {
  const handlerName = REFUND_CHECK_HANDLER;
  const exists = ScriptApp.getProjectTriggers()
    .some(trigger => trigger.getHandlerFunction() === handlerName);
  if (!exists) {
    createRefundCheckTrigger();
  }
}

/**
 * Deletes any existing time-driven triggers for the URL availability check.
 */
function deleteUrlCheckTriggers() {
  const handlerName = URL_CHECK_HANDLER;
  const triggers = ScriptApp.getProjectTriggers()
    .filter(trigger => trigger.getHandlerFunction() === handlerName);
  triggers.forEach(trigger => {
    try {
      ScriptApp.deleteTrigger(trigger);
    } catch (e) {
      Logger.log('Failed to delete URL check trigger ID ' + (trigger.getUniqueId ? trigger.getUniqueId() : '[unknown]') + ': ' + e.toString());
    }
  });
}

/**
 * Creates an hourly time-based trigger for the URL availability check.
 * Any existing URL-check triggers are removed first.
 */
function createUrlCheckTrigger() {
  deleteUrlCheckTriggers();
  try {
    ScriptApp.newTrigger(URL_CHECK_HANDLER)
      .timeBased()
      .everyHours(URL_CHECK_INTERVAL_HOURS)
      .create();
  } catch (e) {
    Logger.log('Failed to create URL check trigger: ' + e.toString());
  }
}

/**
 * Ensures that an hourly URL availability check trigger exists.
 * Creates one if none is found.
 */
function restoreUrlCheckTrigger() {
  const handlerName = URL_CHECK_HANDLER;
  const exists = ScriptApp.getProjectTriggers()
    .some(trigger => trigger.getHandlerFunction() === handlerName);
  if (!exists) {
    createUrlCheckTrigger();
  }
}