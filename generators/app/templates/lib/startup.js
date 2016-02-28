/*
 * <%= appTitle %> - <%= githubUrl %>
 *
 * Copyright (c) <%= year %> <%= userName %>
 */

'use strict';

var fs = require('fs');
var path = require('path');
var util = require('util');

var _ = require('lodash');
var Q = require('q');

var UNKNOWN_PID = 0;

/**
 * @name StartupOptions
 * @property {string} [homePath] the path of the application home.
 * @property {string} [name] the name of the application
 * @property {number} [stopWaiting] the kill waiting duration
 * @property {function} [shutdown] the function is calling by the signal shutdown.
 */

/**
 * The startup function is checking whether an other instance is running, if yes, then it kill the other instance.
 *
 * @param {StartupOptions} options the startup options
 * @return {Q.promise}
 */
module.exports = function startup(options) {
  var homePath = options.homePath || process.cwd();
  var pidName = options.name || 'server';
  var stopWaiting = options.stopWaiting || 500;
  var shutdown = options.shutdown || function () { };

  var pidFilename = path.join(homePath, pidName + '.pid');

  /** @type {Q.promise} */
  return _readPid(pidFilename)
    .then(
      function (pid) {
        return _killProcess(pid, stopWaiting);
      }
    )
    .then(function () {
      return _writePid(pidFilename)
    })
    .then(function () {
      // register the shutdown function
      process.on('SIGINT', function () {
        _shutdown('Ctrl+C', shutdown);
      });
      process.on('SIGTERM', function () {
        _shutdown('kill', shutdown);
      });
      return true;
    });
};


function _readPid(filename) {
  var done = Q.defer();
  fs.readFile(filename, 'utf8', function (err, content) {
    if (err) {
      return done.resolve(UNKNOWN_PID);
    }
    try {
      done.resolve(parseInt(content, 10));
    } catch (e) {
      done.resolve(UNKNOWN_PID);
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


function _shutdown(name, shutdownCallback) {

  if (_.isFunction(shutdownCallback)) {
    shutdownCallback(name);
  }
  process.exit(0);
}
