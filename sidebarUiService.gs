
function openSidebar() {
  var template = HtmlService.createTemplateFromFile('Sidebar');
  var html = template.evaluate().setTitle('LTD Lifeline');
  SpreadsheetApp.getUi().showSidebar(html);
}

function openSettingsSidebar() {
  var template = HtmlService.createTemplateFromFile('SettingsSidebar');
  var html = template.evaluate().setTitle('LTD Lifeline Settings');
  SpreadsheetApp.getUi().showSidebar(html);
}

function closeSidebar() {
  var html = HtmlService.createHtmlOutput('<script>google.script.host.close();</script>');
  SpreadsheetApp.getUi().showSidebar(html);
}

function include(filename) {
  if (filename === 'style') {
    return HtmlService.createHtmlOutputFromFile('confirmMissingFileStyle').getContent();
  }
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}