/*
 * Temperature Monitor Server - https://github.com/blueskyfish/temperature-monitor-server.git
 *
 * Copyright (c) 2016 BlueSkyFish
 */

/**
 * Middleware handler for read the http header field and measure the request time.
 *
 * @module <%= shortcut %>/middleware
 *
 * @requires <%= shortcut %>/logger
 */

'use strict';

const logger  = require('app/logger').getLogger('<%= shortcut %>.middleware');

/**
 * measureTime - Returns the middleware, that measure the time of every request.
 *
 * @return {Function} middleware function.
 */
module.exports.measureTime = function () {
  return function measureTimeMiddleware(req, res, next) {
    const startTime = Date.now();
    const url = req.originalUrl;
    next();
    logger.debug('request "', url, '" in ', Date.now() - startTime, ' ms');
  }
};
