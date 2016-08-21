/*
 * <%= appTitle %> - <%= githubUrl %>
 *
 * Copyright (c) <%= year %> <%= userName %>
 */

/**
 * Manages the sending of an promise callback.
 *
 * @module <%= shortcut %>/http-util
 */

'use strict';

const _HTTP_STATUS_OKAY = 200;
const _HTTP_STATUS_BAD_REQUEST = 400;
const _HTTP_STATUS_SERVER_ERROR = 500;

module.exports = {

  /**
   * The http status **okay** (200).
   *
   * @type {number}
   */
  HTTP_STATUS_OKAY: _HTTP_STATUS_OKAY,

  /**
   * The http status **bad request** (400).
   *
   * @type {number}
   */
  HTTP_STATUS_BAD_REQUEST: _HTTP_STATUS_BAD_REQUEST,

  /**
   * The http status **server error** (500).
   *
   * @type {number}
   */
  HTTP_STATUS_SERVER_ERROR: _HTTP_STATUS_SERVER_ERROR
};
