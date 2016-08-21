/*
 * Temperature Monitor Server - https://github.com/blueskyfish/temperature-monitor-server.git
 *
 * Copyright (c) 2016 BlueSkyFish
 */

/**
 * Handler for shutdown callbacks.
 *
 * @module <%= shortcut %>/shutdown
 *
 * @requires lodash
 * @requires <%= shortcut %>/logger
 */

'use strict';

var _ = require('lodash');

var logger = require('app/logger').getLogger('<%= shortcut %>.shutdown');

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
    logger.debug('[shutdown] add a listener');
    mListeners.push(cb);
  }
}


function _shutdown (name) {
  _.forEach(mListeners, function (cb) {
    cb(name);
  });
  logger.info('[shutdown] application is shutdown "', name, '"!');
}
