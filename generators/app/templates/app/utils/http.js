/*
 * <%= appTitle %> - <%= githubUrl %>
 *
 * Copyright (c) <%= year %> <%= userName %>
 */

/**
 * Utility library for handle request
 *
 * @module <%= shortcut %>/utils/http
 */

'use strict';

let httpStatus = {};

Object.defineProperty(httpStatus, 'OKAY', { value: 200, writable: false, enumerable: true });
Object.defineProperty(httpStatus, 'BAD_REQUEST', { value: 400, writable: false, enumerable: true });
Object.defineProperty(httpStatus, 'UNAUTHORIZED', { value: 401, writable: false, enumerable: true });
Object.defineProperty(httpStatus, 'FORBIDDEN', { value: 403, writable: false, enumerable: true });
Object.defineProperty(httpStatus, 'NOT_FOUND', { value: 404, writable: false, enumerable: true });
Object.defineProperty(httpStatus, 'NOT_ALLOW', { value: 405, writable: false, enumerable: true });
Object.defineProperty(httpStatus, 'NOT_ACCEPTABLE', { value: 406, writable: false, enumerable: true });
Object.defineProperty(httpStatus, 'SERVER_ERROR', { value: 500, writable: false, enumerable: true });

/**
 * The http status codes.
 */
module.exports.HTTP_STATUS = httpStatus;

/**
 * Try to send the result of the promise.
 *
 * @param {Request} req
 * @param {Response} res
 * @param {Promise} promise the promise result
 * @param {string} [propertyName] the name of the property
 * @param {number} [errorStatus] the error http status code
 */
module.exports.sendResult = function (req, res, promise, propertyName, errorStatus) {
  if (promise && _.isFunction(promise.then)) {
    return promise.then((result) => {
      let data = {
        status: 'okay'
      };
      data[propertyName || 'data'] = result;
      res.send(data);
    }, (reason) => {
      res.status(errorStatus || this.HTTP_STATUS.BAD_REQUEST)
        .send({
          status: 'error',
          url: req.originalUrl,
          method: req.method,
          error: reason
        });
    });
  }
  // parmeter "promise" is not a Promise instance
  res.status(errorStatus || this.HTTP_STATUS.SERVER_ERROR)
    .send({
      url: req.originalUrl,
      method: req.method,
      message: 'should be a promise instance'
    });
};
