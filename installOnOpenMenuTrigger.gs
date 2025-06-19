function onOpen(e) {
  const ui = SpreadsheetApp.getUi();
  ui.createMenu('LTD Tracker')
    .addItem(APP_CONFIG.MENU_NAME, 'openSidebar')
    .addToUi();
  setHeaderStyle();
}

function onInstall(e) {
  onOpen(e);
}