/*
 * <%= appTitle %> - <%= githubUrl %>
 *
 * Copyright (c) <%= year %> <%= userName %>
 */

'use strict';

var fs = require('fs');
var path = require('path');

var _ = require('lodash');
var minimist = require('minimist');

var mParams = minimist(process.argv.slice(2));

var DEFAULT_PORT = 40000;
var DEFAULT_HOST = 'localhost';
var DEFAULT_FILENAME = 'info.json';

var mSettings = _loadSettings();

/**
 * @class Settings
 */

/**
 *
 * @type {Settings}
 */
module.exports = {

  /**
   * Returns the verbose status.
   *
   * @return {boolean}
   */
  isVerbose: function () {
    return mParams.verbose || mParams.v || false;
  },

  /**
   * Application should show the help messages
   *
   * @return {boolean}
   */
  isHelp: function () {
    return mParams.help || false;
  },

  /**
   * Returns the port number on which the server should listen.
   *
   * @return {number}
   */
  getPort: function () {
    return getPort_();
  },

  /**
   * Returns the host name on which the server should listen.
   *
   * @return {string}
   */
  getHost: function () {
    return mParams.host ? mParams.host : DEFAULT_HOST;
  },

  /**
   * Returns the environment value
   *
   * @param {string} name
   * @returns {null|string}
   */
  fromEnv: function (name) {
    return fromEnv_(name);
  },

  /**
   * Returns the home directory

   * @returns {string}
   */
  getHomePath: function () {
    return getHomePath_();
  },

  /**
   * Returns the setting value.
   * @param {string} name
   * @param {*} defValue
   * @return {*}
   */
  getSetting: function (name, defValue) {
    return getSetting_(name, defValue);
  }
};

function getPort_() {
  if (mParams.port) {
    var port = parseInt(mParams.port, 10);
    if (isNaN(port)) {
      return DEFAULT_PORT;
    }
    return port;
  }
  return DEFAULT_PORT;
}

function fromEnv_(name) {
  var upName = name.toUpperCase();
  var loName = name.toLowerCase();
  return process.env[upName] ||
    process.env[loName] ||
    null;
}


function getHomePath_() {
  var homePath = fromEnv_('<%= appShort %>_HOME');
  if (!homePath) {
    throw new Error('Missing the environment variable "<%= appShort %>_HOME"');
  }
  return homePath;
}

function getSetting_(name, defValue) {
  return _.get(mSettings, name, defValue);
}

function _loadSettings() {
  var filename = path.join(getHomePath_(), DEFAULT_FILENAME);
  var setting = {};
  if (fs.existsSync(filename)) {
    setting = require(filename);
  }
  return setting;
}
