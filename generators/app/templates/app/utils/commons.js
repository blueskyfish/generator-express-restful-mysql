/*
 * <%= appTitle %> - <%= githubUrl %>
 *
 * Copyright (c) <%= year %> <%= userName %>
 */

'use strict';

const _ = require('lodash');

/**
 * Splits the text with the new line separator.
 * 
 * @param {string} text
 * @return {string[]}
 */
module.exports.splitting = function (text) {
  if (!_.isString(text)) {
    return [];
  }
  return _.split(text, '\n');
};
