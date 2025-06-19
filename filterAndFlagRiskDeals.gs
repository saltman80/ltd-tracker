const STATUS_OK = 'OK';
const ALERT_THRESHOLD = 7;
const COL_REVIEWED = 5;

function filterAtRiskDeals() {
  try {
    const sheet = SpreadsheetApp.getActiveSheet();
    const data = sheetService.getSheetData();
    const showRows = [];
    const hideRows = [];
    data.forEach(row => {
      const rowIndex = row.rowIndex;
      const reviewed = sheet.getRange(rowIndex, COL_REVIEWED).getValue();
      const isAtRisk = (row.status !== STATUS_OK || row.daysLeft <= ALERT_THRESHOLD) && !reviewed;
      if (isAtRisk) {
        showRows.push(rowIndex);
      } else {
        hideRows.push(rowIndex);
      }
    });
    showRows.forEach(r => sheet.showRows(r));
    hideRows.forEach(r => sheet.hideRows(r));
  } catch (error) {
    console.error('filterAtRiskDeals error:', error);
    throw error;
  }
}

/**
 * Marks a deal as reviewed and reapplies the at-risk filter.
 * @param {number} rowIndex - the index of the row to mark as reviewed.
 */
function toggleReviewed(rowIndex) {
  try {
    const sheet = SpreadsheetApp.getActiveSheet();
    sheet.getRange(rowIndex, COL_REVIEWED).setValue(true);
    filterAtRiskDeals();
  } catch (error) {
    console.error('toggleReviewed error:', error);
    throw error;
  }
}

/**
 * Resets all filters by showing all data rows.
 */
function resetFilters() {
  try {
    const sheet = SpreadsheetApp.getActiveSheet();
    const lastRow = sheet.getLastRow();
    if (lastRow >= 2) {
      sheet.showRows(2, lastRow - 1);
    }
  } catch (error) {
    console.error('resetFilters error:', error);
    throw error;
  }
}