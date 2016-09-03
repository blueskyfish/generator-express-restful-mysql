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
 * Configures the application.
 *
 * @module <%= shortcut %>/configure
 *
 * @requires fs
 * @requires path
 * @requires q
 */

'use strict';

const fs   = require('fs');
const path = require('path');

const Q    = require('q');

const UNKNOWN_PID = 0;

/**
 * @name ConfigureOptions
 * @property {string}   [configFilename] the filename of the configuration file.
 * @property {string}   [name] the name of the application
 * @property {function} [shutdown] the function is calling by the signal shutdown.
 */


/**
 * Configure the application.
 *
 * * First step is to stop a former application that pid is written in PID file.
 * * Second step is write the own pid into the PID file
 * * Next step is to register the exit callback function.
 * * Last step is the read the configuration file and create the Configuration instance.
 *
 * @param {ConfigureOptions} options the options
 * @return the promise resolve callback has the parameter as a JSON settings instance.
 */
module.exports = function configure (options) {
  const appName      = options.name || '<%= shortcut %>-server';

  // get the pathname of the configuration or the current working directory.
  const confPathname = options.configFilename || (path.join(process.cwd(), appName + '.json'));
  const homePath     = path.dirname(confPathname);
  const pidPathname  = path.join(homePath, appName + '.pid');

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
      return true;
    })
    .then(function () {
      // read the configuration
      return _readConfig(confPathname)
        .then(function (settings) {
          settings.homePath = homePath;
          return settings;
        })
    });
};

function _readPid(pathname) {
  const done = Q.defer();
  fs.readFile(pathname, 'utf8', function (err, content) {
    if (err) {
      done.resolve(UNKNOWN_PID);
      return;
    }
    try {
      done.resolve(parseInt(content, 10));
    } catch (e) {
      done.resolve(UNKNOWN_PID);
    }
  });
  return done.promise;
}

function _readConfig(pathname) {
  const done = Q.defer();
  fs.readFile(pathname, 'utf8', function (err, content) {
    if (err) {
      return done.reject({
        code: 'CONFIG_NOT_FOUND',
        message: 'Could not found the configuration file "' + pathname + '"!',
        error: err.message || 'no additional information'
      });
    }
    try {
      const settings = JSON.parse(content);
      done.resolve(settings);
    } catch (e) {
      done.reject({
        code: 'CONFIG_PARSE',
        message: 'Invalidate JSON format on "' + pathname + '"!',
        error: !e ? 'null' : e.message || 'no additional information'
      });
    }
  });
  return done.promise;
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
  var done = Q.defer();

  process.nextTick(function () {

    if (pid <= UNKNOWN_PID || !_checkProcess(pid)) {
      // pid is unknown !!
      return done.resolve();
    }
    console.info('send the signal "SIGTERM" to the other process "%s" !!', pid);
    if (!_sendKill(pid, 'SIGTERM')) {
      // error?
      return done.reject(util.format('Could not terminate the process [%s]', pid));
    }
    // wait duration and check whether other process is running
    setTimeout(function () {
      console.info('try to send the signal "SIGKILL" to the other process "%s" !!', pid);
      if (_checkProcess(pid)) {
        // send the signal "SIGKILL" to the other process!!!
        if (!_sendKill(pid, 'SIGKILL')) {
          return done.reject(util.format('Could not kill the process [%s]', pid));
        }
        done.resolve();
      }
      done.resolve();
    }, stopWaiting);
  });

  return done.promise;
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
  var done = Q.defer();
  fs.writeFile(pidFilename, process.pid, 'utf8', function (err) {
    if (err) {
      return done.reject(err);
    }
    done.resolve();
  });
  return done.promise;
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
