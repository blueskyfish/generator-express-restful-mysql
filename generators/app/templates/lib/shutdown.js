/*
 * <%= appTitle %> - <%= githubUrl %>
 *
 * Copyright (c) <%= year %> <%= userName %>
 */

'use strict';

var _ = require('lodash');

var logger = require('./logger')('<%= shortcut %>.shutdown');

var mListeners = [];

module.exports = {

  /**
   * Add a shutdown callback listener
   * @param {function} cb the callback function
   */
  addListener: function (cb) {
    _addListener(cb);
  },

  /**
   * Call all callback functions
   * @param {string} name
   */
  shutdown: function (name) {
    _shutdown(name);
  }
};


function _addListener(cb) {
  if (_.isFunction(cb) && mListeners.indexOf(cb) < 0) {
    logger.debug('[Shutdown] add a listener');
    mListeners.push(cb);
  }
}


function _shutdown (name) {
  logger.info('[Shutdown] application is shutdown "', name, '"!');
  _.forEach(mListeners, function (cb) {
    cb(name);
  });
}
