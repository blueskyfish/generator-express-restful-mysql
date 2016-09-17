/*
 * <%= appTitle %> - <%= githubUrl %>
 *
 * Copyright (c) <%= year %> <%= userName %>
 */

/**
 * Manages the sending of an promise callback.
 *
 * @module <%= shortcut %>/http-status
 */

'use strict';

var httpStatus = {};

Object.defineProperty(httpStatus, 'OKAY',           { value: 200, writable: false, enumerable: true});
Object.defineProperty(httpStatus, 'BAD_REQUEST',    { value: 400, writable: false, enumerable: true});
Object.defineProperty(httpStatus, 'UNAUTHORIZED',   { value: 401, writable: false, enumerable: true});
Object.defineProperty(httpStatus, 'FORBIDDEN',      { value: 403, writable: false, enumerable: true});
Object.defineProperty(httpStatus, 'NOT_FOUND',      { value: 404, writable: false, enumerable: true});
Object.defineProperty(httpStatus, 'NOT_ALLOW',      { value: 405, writable: false, enumerable: true});
Object.defineProperty(httpStatus, 'NOT_ACCEPTABLE', { value: 406, writable: false, enumerable: true});
Object.defineProperty(httpStatus, 'SERVER_ERROR',   { value: 500, writable: false, enumerable: true});

module.exports = httpStatus;
