function sendEmailAlert(row, type) {
  if (!row || typeof type !== 'string') {
    Logger.log('sendEmailAlert: invalid arguments: name=%s, url=%s, daysLeft=%s, type=%s',
      row && row.name, row && row.url, row && row.daysLeft, type);
    return;
  }
  const name = row.name;
  if (!name) {
    Logger.log('sendEmailAlert: missing row.name for type %s', type);
    return;
  }
  const recipient = Session.getActiveUser().getEmail();
  let subject;
  let body;
  if (type === 'down') {
    const url = row.url;
    if (!url) {
      Logger.log('sendEmailAlert: missing row.url for down alert for %s', name);
      return;
    }
    const timeZone = SpreadsheetApp.getActiveSpreadsheet().getSpreadsheetTimeZone();
    const timestamp = Utilities.formatDate(new Date(), timeZone, 'yyyy-MM-dd HH:mm:ss');
    subject = 'LTD Site Down: ' + name;
    body = 'The site ' + url + ' appears to be down as of ' + timestamp + '.';
  } else if (type === 'refund') {
    const daysLeft = row.daysLeft;
    if (daysLeft == null || isNaN(daysLeft)) {
      Logger.log('sendEmailAlert: missing or invalid row.daysLeft for refund alert for %s', name);
      return;
    }
    subject = 'Refund Deadline Approaching: ' + name;
    body = 'Only ' + daysLeft + ' day(s) left to request a refund for ' + name + '.';
  } else {
    Logger.log('sendEmailAlert: unknown type: %s', type);
    return;
  }
  try {
    GmailApp.sendEmail(recipient, subject, body, { name: 'LTD Tracker' });
    Logger.log('sendEmailAlert: email sent to %s with subject "%s"', recipient, subject);
  } catch (e) {
    Logger.log('sendEmailAlert: failed to send email: %s', e.toString());
  }
}