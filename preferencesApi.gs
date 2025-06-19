/**
 * Fetches all user preferences for the preferences editor sidebar.
 * @return {Object} mapping of preference keys to values
 */
function doGetPreferences() {
  try {
    return userPreferencesManager.getAll();
  } catch (err) {
    console.error('doGetPreferences error:', err);
    throw err;
  }
}

/**
 * Saves the provided preferences using the userPreferencesManager.
 * @param {Object} prefs Object where each key corresponds to a preference name
 */
function doSetPreference(prefs) {
  try {
    if (!prefs || typeof prefs !== 'object') {
      throw new Error('Invalid prefs parameter');
    }
    Object.keys(prefs).forEach(function(key) {
      userPreferencesManager.set(key, prefs[key]);
    });
  } catch (err) {
    console.error('doSetPreference error:', err);
    throw err;
  }
}
