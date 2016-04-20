/*
 * <%= appTitle %> - <%= githubUrl %>
 *
 * Copyright (c) <%= year %> <%= userName %>
 */

'use strict';

var _ = require('lodash');

var logger = require('./logger').getLogger('bicycle.duration');


module.exports = {

  /**
   * Measures the time for every request.
   *
   * @return {Function}
   */
  measureTime: function () {
    return _requestMeasureTime;
  },

  /**
   * Starts a measure of time. The returns function should be called on the end of the
   * measure and it returns the none seconds.
   *
   * @return {Function}
   */
  startMeasure: function () {
    return startMeasure_();
  }
};


function _requestMeasureTime(req, res, next) {
  if (!logger.isDebugEnabled()) {
    next();
    return;
  }
  var measure = startMeasure_();
  var url = req.originalUrl;
  next();
  logger.debug('measure time: ', measure(), ' ns "', url, '"');
}


function startMeasure_() {
  var startTime = process.hrtime();
  return function () {
    var diff = process.hrtime(startTime);
    return _calcNSeconds(diff);
  }
}

function _calcNSeconds(diff) {
  return diff[0] * 1e9 + diff[1];
}

