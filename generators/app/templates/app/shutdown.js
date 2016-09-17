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

const _ = require('lodash');

const logger = require('app/logger').getLogger('<%= shortcut %>.shutdown');

const mListeners = [];

/**
 * Add a shutdown callback listener
 * @param {function} cb the callback function
 */
module.exports.addListener = function (cb) {
  if (_.isFunction(cb) && mListeners.indexOf(cb) < 0) {
    logger.debug('add a listener');
    mListeners.push(cb);
  }
};

/**
 * Call all callback functions
 * @param {string} name
 */
module.exports.shutdown = function (name) {
  _.forEach(mListeners, function (cb) {
    cb(name);
  });
  logger.info('application is shutdown "', name, '"!');
};
