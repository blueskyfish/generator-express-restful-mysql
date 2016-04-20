/*
 * <%= appTitle %> - <%= githubUrl %>
 *
 * Copyright (c) <%= year %> <%= userName %>
 */

'use strict';

var path = require('path');

var info     = require('./info');
var eventBus = require('./eventbus');
var phase    = require('./phase');
var settings = require('./settings');

var loggerFactory = require('bluesky-logger');
var fileAppender = require('bluesky-logger/file-appender');

var DEFAULT_SEPARATOR     = '.';
var LOGGER_CONSOLE        = 'console';
var LOGGER_FILE           = 'file';
var DEFAULT_LOGGER_CONFIG = {
  'root': 'info',         // every unknown namespace has the log level "info"
  '<%= appShort %>': 'debug'      // every "bicycle" and sub namespace has the log level "debug"
};


// Subscribe the event "phase.changed"
eventBus.subscribe('phase.changed', function () {
  if (phase.isRunning()) {
    _loadConfigurationForLoggerFactory();
  }
});

module.exports = {

  /**
   * Returns the logger.
   * @param {string} namespace the namespace
   * @return {Logger}
   */
  getLogger: function (namespace) {
    return loggerFactory.getLogger(namespace);
  }
};

function _loadConfigurationForLoggerFactory() {
  // Logger Configuration
  loggerFactory
    .config(settings.getSetting('logger.config', DEFAULT_LOGGER_CONFIG))
    .setSeparator(settings.getSetting('logger.separator', DEFAULT_SEPARATOR));
  
  if (settings.getSetting('logger.appender', LOGGER_CONSOLE) === LOGGER_FILE) {
    // create the filer append message...
    // file path is the BICYCLE_HOME + "logs"
    // file name is the application name
    var filer = fileAppender({
      path: path.join(settings.getHomePath(), 'logs'),
      name: info.getAppName()
    });
    
    loggerFactory.setWriter(filer.appendMessage);
  }
}
