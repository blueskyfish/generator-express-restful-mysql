/*
 * <%= appTitle %> - <%= githubUrl %>
 *
 * Copyright (c) <%= year %> <%= userName %>
 */

/**
 * Middleware handler for read the http header field and measure the request time.
 *
 * @module <%= shortcut %>/middleware/measure
 *
 * @requires <%= shortcut %>/logger
 */

'use strict';

const logger  = require('app/logger').getLogger('<%= shortcut %>.middleware.measure');

/**
 * measureTime - Returns the middleware, that measure the time of every request.
 *
 * @return {Function} middleware function.
 */
module.exports = function () {
  return function measureTimeMiddleware(req, res, next) {
    const startTime = Date.now();
    const url = req.originalUrl;
    const method = req.method;
    next();
    logger.info('request [' + method + ']: "', url, '" in ', Date.now() - startTime, ' ms');
  }
};
