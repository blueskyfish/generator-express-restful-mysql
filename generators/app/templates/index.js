/*
 * <%= appTitle %> - <%= githubUrl %>
 *
 * Copyright (c) <%= year %> <%= userName %>
 */

'use strict';

var fs = require('fs');

var _ = require('lodash');

var app = require('./lib/application');
var info = require('./lib/info');
var logger   = require('./lib/logger').getLogger('bicycle.app');
var settings = require('./lib/settings');
var runner   = require('./lib/runner');

if (settings.isHelp()) {
  var content = fs.readFileSync('./man.txt');
  // Application Header
  info.showHeader();
  console.info(content.toString());
  process.exit(0);
}

// Application Header
info.showHeader(logger);

/**
 * @type {StartOptions}
 */
var startupOptions = {
  homePath: settings.getHomePath(),
  name: info.getAppName(),
  stopWaiting: settings.getSetting('stop.waiting', 500)
};

// The runner tries to start the application and turns the phase into "running"
runner.start(startupOptions)
  .then(function () {
    var port = settings.getPort();
    var host = settings.getHost();

    app.listen(port, host, function () {
      logger.info('Bicycle Service Book Server is listen http://', host, ':', port);
    });

  }, function (reason) {
    if (!_.isString(reason)) {
      reason = JSON.stringify(reason, null, 3);
    }
    logger.warn('Starts the application has occurred an Error:');
    logger.warn(reason);
  });

