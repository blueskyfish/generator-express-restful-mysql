/*
 * <%= appTitle %> - <%= githubUrl %>
 *
 * Copyright (c) <%= year %> <%= userName %>
 */

/**
 * Utility function for settings and / or configuration.
 *
 * @module <%= shortcut %>/config-util
 *
 * @requires lodash
 */

'use strict';

const _ = require('lodash');

/**
 * Returns the value of the name element in the setting object.
 *
 * @param {object} settings the setting object
 * @param {string} name the name of the setting element
 * @param {*} defValue the default value if the element is not exist.
 * @return {*} The value
 */
module.exports.getSetting = function (settings, name, defValue) {
  return _.get(settings, name, defValue);
};
