/*
 * <%= appTitle %> - <%= githubUrl %>
 *
 * Copyright (c) <%= year %> <%= userName %>
 */

/**
 * Configures and startup the application server
 *
 * @module <%= shortcut %>
 *
 * @requires app-module-path
 * @requires fs
 * @requires <%= shortcut %>/info
 * @requires <%= shortcut %>/args
 * @requires <%= shortcut %>/configure
 * @requires <%= shortcut %>/shutdown
 */

'use strict';

//
// add the current directory to the require paths.
//   -> all internal modules have the save require path "app/services/..." or "app/info"
//
require('app-module-path').addPath(__dirname);

const fs        = require('fs');

const info      = require('app/info');
const args      = require('app/args');
const configure = require('app/configure');
const shutdown  = require('app/shutdown');


if (args.isHelp()) {
  const content = fs.readFileSync('./man.txt');
  _printHeaderAndHero();
  console.info(content.toString());
  process.exit(0);
}

/**
 * @type {ConfigureOptions}
 */
var configureOptions = {
  configFilename: args.getConfigFilename(),
  name:       info.getAppName(),
  shutdown: function (name) {
    shutdown.shutdown(name);
    console.info('[<%= shortcut %>] Server is shutdown with "%s"', name);
  }
};

//
// Try to prepare the startup and returns the settings object.
//
configure(configureOptions)
  .then(function (settings) {
      var logger = null;
      try {
        // initialize Logger
        logger = require('app/logger').start(settings);
        // print the header
        _printHeaderAndHero(logger);
        logger.info('Logger is started...');
        // initialize DB
        require('app/db').start(settings);
        logger.info('Connection pool is started successful...');

        // TODO Add things for starting or initialize with settings

        // start the application
        require('app/application')
          .start(settings)
          .then(function () {
            // now the express application is listen
            logger.info('[<%= shortcut %>] running ...');
          });
      } catch (e) {
        if (logger) {
          logger.warn('[<%= shortcut %>] ', e);
        } else {
          logger.warn('[<%= shortcut %>] ', e);
        }
      }
    },
    function (reason) {
      console.warn('[%s] %s', reason.code || 'UNKNOWN', reason.message || 'Unknown message');
      console.warn('[%s] object -> %s', reason.code || 'UNKNOWN', JSON.stringify(reason));
    }
  );

/**
 * Prints the header and the hero ascii art to the console and logger.
 *
 * @param {logger} [logger]
 * @private
 */
function _printHeaderAndHero(logger) {
  if (fs.existsSync('./hero.txt')) {
    const hero = fs.readFileSync('./hero.txt', 'utf8').toString();
    const lines = hero.split('\n');
    lines.forEach(function (line) {
      if (logger) {
        logger.info(line);
        if (logger.isConsole) {
          return;
        }
      }
      console.info(line);
    });
  }
  info.headerPrint(logger);
}
