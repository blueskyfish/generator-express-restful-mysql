/*
 * <%= appTitle %> - <%= githubUrl %>
 *
 * Copyright (c) <%= year %> <%= userName %>
 */

'use strict';

var pkg = require('../package.json');

module.exports = {

  getAppName: function () {
    return pkg.name;
  },

  getAppTitle: function () {
    return pkg.title;
  },

  getAppVersion: function () {
    return pkg.version;
  },

  getAppVendor: function () {
    return pkg.author;
  },

  getAppDescription: function () {
    return pkg.description;
  },

  /**
   * Show the application header in the console log or in the logger
   * @param {Logger} [logger] the optional logger
   */
  showHeader: function (logger) {
    showHeader_(logger);
  }
};


function showHeader_(logger) {
  if (logger) {
    logger.info('');
    logger.info('---< ', pkg.title, ' >----------------------------------------------');
    logger.info('  ', pkg.title, ' (', pkg.version, ')');
    logger.info('  ', pkg.author);
    logger.info('');
  }
  console.info('');
  console.info('%s (%s)', pkg.title, pkg.version);
  console.info('  %s', pkg.author);
  console.info('');
}
