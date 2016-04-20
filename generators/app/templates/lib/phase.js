/*
 * <%= appTitle %> - <%= githubUrl %>
 *
 * Copyright (c) <%= year %> <%= userName %>
 */

'use strict';

var eventBus = require('./eventbus');

var PHASE_STARTUP  = 'startup';
var PHASE_RUNNING  = 'running';
var PHASE_SHUTDOWN = 'shutdown';

var mCurrentPhase  = PHASE_STARTUP;

module.exports = {

  isStartup: function () {
    return mCurrentPhase === PHASE_STARTUP;
  },

  isRunning: function () {
    return mCurrentPhase === PHASE_RUNNING;
  },

  isShutdown: function () {
    return mCurrentPhase === PHASE_SHUTDOWN;
  },

  /**
   * Turns the phase from "startup" to "running".
   *
   * @return {boolean} true, when doing
   */
  turnRunning: function () {
    return turnRunning_();
  },

  turnShutdown: function () {
    return turnShutdown_();
  }
};

function turnRunning_() {
  if (mCurrentPhase !== PHASE_STARTUP) {
    return false;
  }
  mCurrentPhase = PHASE_RUNNING;
  return eventBus.send('phase.changed');
}

function turnShutdown_() {
  if (mCurrentPhase !== PHASE_RUNNING) {
    return false;
  }
  mCurrentPhase = PHASE_SHUTDOWN;
  return eventBus.send('phase.changed');
}

/*
function turnRunning_(options) {
  if (mCurrentPhase !== PHASE_STARTUP) {
    logger.warn('The current phase is not "', PHASE_STARTUP, '"!!');
    return Q.reject(_createError(0x400001, 'Wrong phase !!'));
  }
  
  var homePath = options.homePath || process.cwd();
  var pidName = options.name || 'server';
  var stopWaiting = options.stopWaiting || 500;

  var pidFilename = path.join(homePath, pidName + '.pid');
  
  mCurrentPhase = PHASE_RUNNING;

  // send the event "phase.changed"
  eventBus.send('phase.changed');

  return fs.readFile(pidFilename, 'utf8')
    .then(function (content) {
      // parse into an number
      return parseInt(content, 10);
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
      logger.info('finally the phase "running" is finish !! Have a good time...');
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
  mCurrentPhase = PHASE_SHUTDOWN;

  eventBus.send('phase.changed');

  logger.info('close application from request "', name, '" !! Bye bye...');
  process.exit(0);
}

function _createError(code, message) {
  return {
    code: code,
    message: message
  };
}
*/
