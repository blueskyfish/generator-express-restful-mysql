/*
 * <%= appTitle %> - <%= githubUrl %>
 *
 * Copyright (c) <%= year %> <%= userName %>
 */

'use strict';

/**
 * @module <%= shortcut %>/logger
 *
 * @requires fs
 * @requires path
 * @requires lodash
 * @requires module:bluesky-logger
 * @requires module:bluesky-logger/file-appender
 * @requires module:<%= shortcut %>/info
 * @requires module:<%= shortcut %>/config-util
 */

const fs   = require('fs');
const path = require('path');

const _             = require('lodash');

const loggerFactory = require('bluesky-logger');
const fileAppender  = require('bluesky-logger/file-appender');

const info          = require('app/info');

const DEFAULT_LOGGER_CONFIG = {
  'root': 'info',
  '<%= shortcut %>': 'debug'
};

// write the log messages to the console or not.
let consoleOutput = true;

/**
 * start - Initialize the logger.
 *
 * @param {object} settings the settings object
 * @return {Logger} the logger for namespace **temo**.
 */
module.exports.start = function (settings) {
  // Logger Configuration
  loggerFactory
    .config(_.get(settings, 'logger.namespaces', DEFAULT_LOGGER_CONFIG))
    .setSeparator(_.get(settings, 'logger.separator', '.'));
  
  if (_.get(settings, 'logger.appender', 'console') === 'file') {

    const logPath = _.get(settings, 'logger.path', '.');
    if (!fs.existsSync(logPath)) {
      // create the log folder / directory.
      fs.mkdirSync(logPath);
    }
    const filer = fileAppender({
      path: logPath,
      name: info.getAppName()
    });
    loggerFactory.setWriter(filer.appendMessage);
    // the log messages are written into file
    consoleOutput = false;
  }
  const logger = loggerFactory.getLogger('<%= shortcut %>');
  logger.isConsole = consoleOutput;
  return logger;
};

/**
 * getLogger - Returns the logger with the given namespace
 *
 * @param {string} name the namespace
 * @return {Logger}
 */
module.exports.getLogger = function (name) {
  const logger = loggerFactory.getLogger(name);
  logger.isConsole = consoleOutput;
  return logger;
};
