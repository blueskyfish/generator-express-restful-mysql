/*
 * <%= appTitle %> - <%= githubUrl %>
 *
 * Copyright (c) <%= year %> <%= userName %>
 */

'use strict';

var _ = require('lodash');

var mEventCache = {};

/**
 * @class EventBus
 * @method subscribe
 * @method send
 */

/**
 * @type {EventBus}
 */
module.exports = {

  /**
   * Subscribes an event.
   *
   * @param {string} eventName the event
   * @param {function} callback the callback function
   * @return {function} a function for removing the callback from event.
   */
  subscribe: function (eventName, callback) {
    return subscribe_(eventName, callback);
  },

  /**
   * Send an event. Optional it can send parameters.
   *
   * @param {string} eventName the event
   * @return {boolean} true if an registered callback is called
   */
  send: function (eventName) {
    if (arguments.length > 1) {
      var paramList = Array.prototype.slice.call(arguments, 1);
      return send_(eventName, paramList);
    }
    return send_(eventName, []);
  }
};

function noop() {}

function subscribe_(eventName, callback) {
  var list = mEventCache[eventName];
  if (!_.isArray(list)) {
    list = mEventCache[eventName] = [];
  }
  if (_.isFunction(callback) && list.indexOf(callback) < 0) {
    // add the callback to the list
    var index = list.push(callback) - 1;
    return function __removeFromSubscribeList() {
      // remove it from the list
      list.splice(index, 1);
    }
  }
  return noop;
}

function send_(eventName, paramList) {
  var list = mEventCache[eventName];
  if (_.isArray(list)) {
    _.forEach(list, function (callback) {
      // synchronously call of all callbacks
      callback.apply(null, paramList);
    });
    return true;
  }
  return false;
}
