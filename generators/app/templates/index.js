/*
 * <%= appTitle %> - <%= githubUrl %>
 *
 * Copyright (c) <%= year %> <%= userName %>
 */

'use strict';

var fs = require('fs');

var app = require('./lib/application');
var settings = require('./lib/settings');
var startup = require('./lib/startup');
var shutdown = require('./lib/shutdown');

console.info('');
console.info('%s (%s)', settings.getAppTitle(), settings.getAppVersion());
console.info('  %s', settings.getAppVendor());
console.info('');

if (settings.isHelp()) {
  var content = fs.readFileSync('./man.txt');
  console.info(content.toString());
  process.exit(0);
}

/**
 * @type {StartupOptions}
 */
var startupOptions = {
  homePath: settings.getHomePath(),
  name: settings.getAppName(),
  stopWaiting: settings.getSetting('stop.waiting', 500),
  shutdown: function (name) {
    shutdown.shutdown(name);
    console.info('<%= appTitle %> server is shutdown with "%s"', name);
  }
};

startup(startupOptions)
  .then(function () {
    var port = settings.getPort();
    var host = settings.getHost();

    app.listen(port, host, function () {
      console.info('<%= appTitle %> Server is listen http://%s:%s', host, port);
    });
  });

