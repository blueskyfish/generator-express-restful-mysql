/*
 * <%= appTitle %> - <%= githubUrl %>
 *
 * Copyright (c) <%= year %> <%= userName %>
 */

'use strict';

var path = require('path');

var _ = require('lodash');
var Q = require('q');

var fs     = require('./fs-then');
var logger = require('./logger').getLogger('<%= shortcut %>.runner');
var phase  = require('./phase');


var UNKNOWN_PID = 0;

/**
 * @name StartOptions
 * @property {string} [homePath] the path of the application home.
 * @property {string} [name] the name of the application
 * @property {number} [stopWaiting] the kill waiting duration
 */

module.exports = {

  /**
   * Starts the application. Before starting, it searches for a former instance and stops this former instance.
   *
   * @param {StartOptions} options then options for finding former instance
   * @return {promise}
   */
  start: function (options) {
    return start_(options);
  }

};

function start_(options) {
  if (!phase.turnRunning()) {
    return Q.reject(_createError(0x40000, 'Could not turn into running'))
  }
  var homePath = options.homePath || process.cwd();
  var pidName = options.name || 'server';
  var stopWaiting = options.stopWaiting || 500;

  var pidFilename = path.join(homePath, pidName + '.pid');

  return fs.readFile(pidFilename, 'utf8')
    .then(function (content) {
      // parse into an number
      return parseInt(content, 10);
    }, function () {
      return Q.resolve(UNKNOWN_PID);
    })
    .then(function (pid) {
      return _killProcess(pid, stopWaiting);
    })
    .then(function () {
      var content = '' + process.pid;
      return fs.writeFile(pidFilename, content, 'utf8');
    })
    .then(function () {
      logger.info('register the shutdown callback');
      // register the shutdown function
      process.on('SIGINT', function () {
        _shutdown('ctrl+c');
      });
      process.on('SIGTERM', function () {
        _shutdown('killer');
      });
      logger.info('finally the application is coming up !! Have a good time...');
      return true;
    });
}

function _killProcess(pid, stopWaiting) {
  var done = Q.defer();

  process.nextTick(function () {

    if (pid <= UNKNOWN_PID || !_checkProcess(pid)) {
      // pid is unknown !!
      logger.info('starts the application !!');
      return done.resolve(true);
    }
    logger.info('send the signal "SIGTERM" to the other process "', pid, '" !!');
    if (!_sendKill(pid, 'SIGTERM')) {
      logger.warn('Could not terminate the other process "', pid, '" !!');
      return done.reject(_createError(0x400002, 'Could not terminate the other process'));
    }
    // wait duration and check whether other process is running
    setTimeout(function () {
      logger.info('try to send the signal "SIGKILL" to the other process "', pid, '" !!');
      if (_checkProcess(pid)) {
        // send the signal "SIGKILL" to the other process!!!
        if (!_sendKill(pid, 'SIGKILL')) {
          logger.warn('Could not kill the other process "', pid, '" !!');
          return done.reject(_createError(0x400003, 'Could not kill the other process'));
        }
        done.resolve(true);
      }
      logger.info('starts the application, alter killing the former instance !!');
      done.resolve(true);
    }, stopWaiting);
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

function _sendKill(pid, signal) {
  try {
    process.kill(pid, signal);
    return true;
  }
  catch (e) {
    return false;
  }
}

function _shutdown(name) {
  if (!phase.turnShutdown()) {
    logger.warn('could not turn into "shutdown"!')
  }
  logger.info('close application from request "', name, '" !! Bye bye...');
  process.exit(0);
}

function _createError(code, message) {
  return {
    code: code,
    message: message
  };
}
