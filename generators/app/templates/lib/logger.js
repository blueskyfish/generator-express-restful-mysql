/*
 * <%= appTitle %> - <%= githubUrl %>
 *
 * Copyright (c) <%= year %> <%= userName %>
 */

'use strict';

var path = require('path');

var settings = require('./settings');

var loggerFactory = require('bluesky-logger');
var fileAppender = require('bluesky-logger/file-appender');

var DEFAULT_LOGGER_CONFIG = {
  'root': 'info',
  '<%= shortcut %>': 'debug'
};

var isInit = false;

/**
 * Returns the logger.
 * @param {string} name the namespace
 * @return {Logger}
 */
module.exports = function getLogger(name) {
  if (!isInit) {
    isInit = true;
    _initLoggerFactory();
  }
  return loggerFactory.getLogger(name);
};

function _initLoggerFactory() {
  // Logger Configuration
  loggerFactory
    .config(settings.getSetting('logger.config', DEFAULT_LOGGER_CONFIG))
    .setSeparator(settings.getSetting('logger.separator', '.'));
  if (settings.getSetting('logger.appender', 'console') === 'file') {
    var filer = fileAppender({
      path: path.join(settings.getHomePath(), 'logs'),
      name: settings.getAppName()
    });
    loggerFactory.setWriter(filer.appendMessage);
  }
}
