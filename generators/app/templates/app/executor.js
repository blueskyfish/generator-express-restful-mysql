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
 *   executor.execute(req, res, function (sender) {
 *
 *     const userModel = req.body;
 *     const promise   = service.save(userModel);
 *     const property  = 'result';
 *
 *     sender(promise, property);
 *   });
 * });
 * ```
 *
 * @module <%= shortcut %>/executor
 *
 * @requires util
 * @requires lodash
 * @requires <%= shortcut %>/http-util
 */

'use strict';

const util       = require('util');

const _          = require('lodash');

const httpStatus = require('app/http-status');

/**
 * Executes the service call, send the result to the client and catches the errors.
 *
 * @param {request}  req the express request
 * @param {response} res the express response
 * @param {function} cb the callback, that collect the answer
 */
module.exports.execute = function (req, res, cb) {
  const url = req.originalUrl;

  function __sender(promise, propertyName) {
    if (!promise.then) {
      res.status(httpStatus.SERVER_ERROR)
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
        res.status(httpStatus.BAD_REQUEST)
          .send(data);
      }
    );
  }
  try {

    cb(__sender);

  } catch (e) {
    e = e.message;
    const message = util.format('[<%= shortcut %>]: %s (%s)', e, url);
    res.status(httpStatus.BAD_REQUEST)
      .send({
        status: 'error',
        message: message
      });
  }
};
