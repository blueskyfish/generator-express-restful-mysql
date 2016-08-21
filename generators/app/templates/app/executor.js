/*
 * <%= appTitle %> - <%= githubUrl %>
 *
 * Copyright (c) <%= year %> <%= userName %>
 */

/**
 * Capsules in a Endpoint the service calls and claims Exception
 *
 * **Example**
 * ```js
 * router.post('/user', function (req, res) {
 *   executor.run(req, res, function () {
 *     const userModel = req.body;
 *     executor.send(service.save(userModel), res, 'result');
 *   });
 * });
 * ```
 *
 * @module <%= shortcut %>/executor
 *
 * @requires util
 * @requires lodash
 * @requires <%= shortcut %>/logger
 * @requires <%= shortcut %>/http-util
 */

'use strict';

const util     = require('util');

const _        = require('lodash');

const logger   = require('app/logger').getLogger('<%= shortcut %>.executor');
const httpUtil = require('app/http-util');

/**
 * Executes the service call and catches the errors.
 *
 * @param {Request}  req the express request
 * @param {Response} res the express response
 * @param {function} cb the callback, that collect the answer
 */
module.exports.run = function (req, res, cb) {
  const url = req.originalUrl;
  try {
    cb();
  } catch (e) {
    e = e.message;
    const message = util.format('[<%= shortcut %>.exe]: %s (%s)', e, url);
    res.status(httpUtil.HTTP_STATUS_BAD_REQUEST)
      .send({
        status: 'error',
        message: message
      });
  }
};

/**
 * Sends the resolve or rejected value.
 *
 * @param {promise} promise the promise with the callback of resolve or reject.
 * @param {response} res the express response object
 * @param {string} propertyName the property name
 */
module.exports.send = function (promise, res, propertyName) {
  if (!promise.then) {
    res.status(httpUtil.HTTP_STATUS_SERVER_ERROR)
      .send({
        status: 'error',
        message: 'Could not found a result'
      });
    return;
  }
  promise.then(
    function (result) {
      var data = {
        status: 'okay'
      };
      data[propertyName] = result;
      res.send(data);
    },
    function (reason) {
      var data = {
        status: 'error',
        error: reason
      };
      res.status(httpUtil.HTTP_STATUS_BAD_REQUEST)
        .send(data);
    }
  );
};
