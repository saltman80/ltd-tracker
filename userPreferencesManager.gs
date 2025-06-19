var userPreferencesManager = (function() {
  var USER_PROPS = PropertiesService.getUserProperties();
  var DEFAULTS = {
    darkMode: false,
    autoRefreshIntervalMinutes: 60,
    emailNotifications: true,
    notifyDaysBeforeExpiry: 3
  };
  var KEYS = Object.keys(DEFAULTS);

  /**
   * Retrieves the value of a user preference.
   * @param {string} key The preference key.
   * @return {boolean|number|string} The stored value or default.
   */
  function getPreference(key) {
    if (DEFAULTS[key] === undefined) {
      throw new Error('Unknown preference key: ' + key);
    }
    var stored = USER_PROPS.getProperty(key);
    if (stored === null) {
      return DEFAULTS[key];
    }
    var def = DEFAULTS[key];
    if (typeof def === 'boolean') {
      return stored === 'true';
    }
    if (typeof def === 'number') {
      var num = Number(stored);
      return isNaN(num) ? DEFAULTS[key] : num;
    }
    return stored;
  }

  /**
   * Sets or clears a user preference.
   * @param {string} key The preference key.
   * @param {boolean|number|string|null|undefined} value The value to set, or null/undefined to reset to default.
   */
  function setPreference(key, value) {
    if (DEFAULTS[key] === undefined) {
      throw new Error('Unknown preference key: ' + key);
    }
    if (value === null || value === undefined) {
      USER_PROPS.deleteProperty(key);
      return;
    }
    var def = DEFAULTS[key];
    if (typeof def === 'boolean') {
      if (typeof value !== 'boolean') {
        throw new Error('Invalid type for ' + key + ', expected boolean');
      }
      USER_PROPS.setProperty(key, value.toString());
    } else if (typeof def === 'number') {
      if (typeof value !== 'number' || isNaN(value)) {
        throw new Error('Invalid type for ' + key + ', expected number');
      }
      USER_PROPS.setProperty(key, value.toString());
    } else {
      USER_PROPS.setProperty(key, value.toString());
    }
  }

  /**
   * Retrieves all user preferences, merged with defaults.
   * @return {Object} An object mapping keys to values.
   */
  function getAllPreferences() {
    var all = {};
    KEYS.forEach(function(key) {
      all[key] = getPreference(key);
    });
    return all;
  }

  /**
   * Clears all user-defined preferences, resetting to defaults.
   */
  function resetPreferences() {
    KEYS.forEach(function(key) {
      USER_PROPS.deleteProperty(key);
    });
  }

  return {
    get: getPreference,
    set: setPreference,
    getAll: getAllPreferences,
    reset: resetPreferences
  };
})();