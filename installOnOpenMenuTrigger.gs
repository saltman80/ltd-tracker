function onOpen(e) {
  const ui = SpreadsheetApp.getUi();
  ui.createMenu('LTD Tracker')
    .addItem(APP_CONFIG.MENU_NAME, 'openSidebar')
    .addItem('Log Date Differences', 'logDateDifferencesInRange')
    .addToUi();
  applyFancySheetStyles();
}

function onInstall(e) {
  onOpen(e);
}