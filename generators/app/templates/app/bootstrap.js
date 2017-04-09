/*
 * <%= appTitle %> - <%= githubUrl %>
 *
 * Copyright (c) <%= year %> <%= userName %>
 *
 * Purpose:
 * Configure the application.
 *
 * Note:
 * Don't use the logger here, because it is not initialized at this time.
 */

/**
 * Bootstrap and configure the application.
 *
 * @module <%= shortcut %>/configure
 *
 * @requires fs
 * @requires path
 * @requires util
 * @requires lodash
 * @requires q
 */

'use strict';

const fs   = require('fs');
const path = require('path');
const util = require('util');

const _    = require('lodash');
const Q    = require('q');

const UNKNOWN_PID = 0;

/**
 * @name BootstrapOptions
 * @property {string}   [configFilename] the filename of the configuration file.
 * @property {string}   [name] the name of the application
 * @property {string}   [path] the path to the pid file.
 * @property {function} [shutdown] the function is calling by the signal shutdown.
 */

/**
 * Bootstrap and configures the application.
 *
 * * First step is to stop a former application that pid is written in PID file.
 * * Second step is write the own pid into the PID file
 * * Next step is to register the exit callback function.
 * * Last step is the read the configuration file and create the Configuration instance.
 *
 * @param {ConfigureOptions} options the options
 * @return the promise resolve callback has the parameter as a JSON settings instance.
 */
module.exports = function bootstrapping (options) {
  const appName      = options.name || '<%= shortcut %>-server';
  const logPath      = options.path || process.cwd();

  // get the pathname of the configuration or the current working directory.
  const confPathname = options.configFilename || (path.join(process.cwd(), appName + '.json'));
  const pidPathname  = path.join(logPath, appName + '.pid');

  // wait between shutdown check!
  // TODO The stop wait is constant or argument
  const stopWaiting  = 500;

  // use the shutdown callback or use the dummy function.
  const shutdown     = options.shutdown || function () { };

  return _readPid(pidPathname)
    .then(function (pid) {
      return _killProcess(pid, stopWaiting);
    })
    .then(function () {
      // write the current pid of the application
      return _writePid(pidPathname);
    })
    .then(function () {
      // register the shutdown function
      process.on('SIGINT', function () {
        _shutdown('Ctrl+C', shutdown);
      });
      process.on('SIGTERM', function () {
        _shutdown('Kill..', shutdown);
      });
      process.on('SIGHUP', function () {
        _shutdown('HangUp', shutdown);
      });
      return true;
    })
    .then(function () {
      // read the configuration
      return _readConfig(confPathname)
        .then(function (settings) {
          _.set(settings, 'logger.path', logPath);
          return settings;
        })
    });
};

// read the former application pid
function _readPid(pathname) {
  return new Promise((resolve, reject) => {
    fs.readFile(pathname, 'utf8', function (err, content) {
      if (err) {
        // file is not exist, then use 0
        return resolve(UNKNOWN_PID);
      }
      try {
        resolve(parseInt(content, 10));
      } catch (e) {
        resolve(UNKNOWN_PID);
      }
    });
  });
}

function _readConfig(pathname) {
  return new Promise((resolve, reject) => {
    fs.readFile(pathname, 'utf8', function (err, content) {
      if (err) {
        return reject({
          code: 'CONFIG_NOT_FOUND',
          message: util.format('Could not found the configuration file "%s"!', pathname),
          error: err.message || 'no additional information'
        });
      }
      try {
        const settings = JSON.parse(content);
        resolve(settings);
      } catch (e) {
        reject({
          code: 'CONFIG_PARSE',
          message: 'Invalidate JSON format on "' + pathname + '"!',
          error: !e ? 'null' : e.message || 'no additional information'
        });
      }
    });
  });
}

function _checkProcess(pid) {
  try {
    process.kill(pid, 0);
    return true;
  } catch (e) {
    return false;
  }
}

function _killProcess(pid, stopWaiting) {
  return new Promis((resolve, reject) {

    process.nextTick(function () {
      if (pid <= UNKNOWN_PID || !_checkProcess(pid)) {
        // pid is unknown !!
        return resolve();
      }
      console.info('send the signal "SIGTERM" to the other process "%s" !!', pid);
      if (!_sendKill(pid, 'SIGTERM')) {
        // error?
        return reject(util.format('Could not terminate the process [%s]', pid));
      }
      // wait duration and check whether other process is running
      setTimeout(function () {
        console.info('try to send the signal "SIGKILL" to the other process "%s" !!', pid);
        if (_checkProcess(pid)) {
          // send the signal "SIGKILL" to the other process!!!
          if (!_sendKill(pid, 'SIGKILL')) {
            return reject(util.format('Could not kill the process [%s]', pid));
          }
        }
        resolve();
      }, stopWaiting);
    });
  });
}

function _sendKill(pid, signal) {
  try {
    process.kill(pid, signal);
    return true;
  }
  catch (e) {
    return false;
  }
}

//
// Writes the own pid into the PID file.
//
function _writePid(pidFilename) {
  return new Promise((resolve, reject) => {
    fs.writeFile(pidFilename, process.pid, 'utf8', function (err) {
      if (err) {
        return reject(err);
      }
      resolve();
    });
  });
}

function _shutdown(name, cb) {
  try {
    cb(name);
  }
  catch (e) {
    console.warn('Error has occurred: %s', e.message);
  }
  finally {
    process.exit();
  }
}
