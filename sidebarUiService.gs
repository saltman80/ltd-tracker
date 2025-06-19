
function openSidebar() {
  var template = HtmlService.createTemplateFromFile('darkModeSidebarManager');
  var html = template.evaluate().setTitle('LTD Lifeline');
  SpreadsheetApp.getUi().showSidebar(html);
  // Ensure the Deals sheet is activated when the sidebar loads
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var dealsSheet = ss.getSheetByName(APP_CONFIG.SHEET_NAME);
  if (dealsSheet) dealsSheet.activate();
}

function openSettingsSidebar() {
  var template = HtmlService.createTemplateFromFile('preferencesSidebarEditor');
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

function getDealsData() {
  try {
    return sheetReadWriteFormatter.getSheetData();
  } catch (err) {
    console.error('getDealsData error:', err);
    throw err;
  }
}