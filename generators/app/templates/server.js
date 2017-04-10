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
 * @requires path
 * @requires <%= shortcut %>/utils/info
 * @requires <%= shortcut %>/utils/args
 * @requires <%= shortcut %>/bootstrap
 * @requires <%= shortcut %>/shutdown
 */

'use strict';

//
// add the current directory to the require paths.
//   -> all internal modules have the save require path "app/services/..." or "app/info"
//
require('app-module-path').addPath(__dirname);

const fs = require('fs');
const path = require('path');

const info = require('app/utils/info');
const args = require('app/utils/args');
const bootstrap = require('app/bootstrap');
const shutdown = require('app/shutdown');


if (args.isHelp()) {
  const content = fs.readFileSync(path.join(__dirname, 'man.txt'));
  _printHero();
  console.info(content.toString());
  process.exit(0);
}

/**
 * @type {BootstrapOptions}
 */
const bootstrapOptions = {
  configFilename: args.getConfigFilename(),
  name: info.getAppName(),
  path: args.getLogPath(),
  shutdown: (name) => {
    shutdown.shutdown(name);
    console.info('Server is shutdown with "%s"', name);
  }
};

//
// Try to prepare the startup and returns the settings object.
//
bootstrap(bootstrapOptions)
  .then((settings) => {
    let logger = null;
    try {
      // initialize Logger
      logger = require('app/logger').start(settings);
      // print the hero & header
      _printHero(logger);
      _printHeader(logger);
      logger.info('Logger is started...');
      // initialize DB
      require('app/db').start(settings);
      logger.info('Connection pool is started successful...');

      // TODO Add things for starting or initialize with settings

      // start the application
      require('app/application')
        .start(settings)
        .then(() => {
          // now the express application is listen
          logger.info('application is running ...');
        }, (reason) => {
          logger.warn(reason);
          process.exit(1);
        });
    } catch (e) {
      if (logger) {
        logger.warn('[<%= shortcut %>] ', e);
      } else {
        console.warn('[<%= shortcut %>] ', e);
      }
    }
  }, (reason) => {
    console.warn('[%s] %s', reason.code || 'UNKNOWN', reason.message || 'Unknown message');
    console.warn('[%s] object -> %s', reason.code || 'UNKNOWN', JSON.stringify(reason));
  });

/**
 * Prints the header and the hero ascii art to the console and logger.
 *
 * @param {logger} [logger]
 * @private
 */
function _printHero(logger) {
  const heroFile = path.join(__dirname, 'hero.txt');
  if (fs.existsSync(heroFile)) {
    const hero = fs.readFileSync(heroFile, 'utf8').toString();
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
}

/**
 * Prints the header information.
 *
 * @param {Logger} [logger] the logger for additional print out the header.
 * @private
 */
function _printHeader(logger) {
  if (logger) {
    logger.info('"', info.getAppTitle(), '" (', info.getAppVersion(), ')');
    logger.info('');
    if (logger.isConsole) {
      // the logger write to the console
      return;
    }
  }
  console.info('%s (%s)', info.getAppTitle(), info.getAppVersion());
  console.info('  %s', info.getAppVendor());
  console.info('');
};
