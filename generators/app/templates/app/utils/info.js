/*
 * <%= appTitle %> - <%= githubUrl %>
 *
 * Copyright (c) <%= year %> <%= userName %>
 */

/**
 * Contains the information about the application. It is read from the package.json
 *
 * @module <%= shortcut %>/utils/info
 *
 * @requires fs
 * @requires path
 */

'use strict';

const fs   = require('fs');
const path = require('path');

const pkg = require(path.join(__dirname, '..', '..', 'package.json'));

let version = {};

//
// try to read the version.json file
//
fs.readFile(path.join(__dirname, '..', '..', 'version.json'), 'utf-8', function (err, content) {
  if (!err) {
    try {
      version = JSON.parse(content);
    } catch (e) {
      //
    }
  }
});

/**
 * Returns the application name
 * 
 * @return {string}
 */
module.exports.getAppName = function () {
  return pkg.name;
};

/**
 * Returns the application title
 * 
 * @return {string}
 */
module.exports.getAppTitle = function () {
  return pkg.title;
};

/**
 * Returns the application version
 * 
 * @return {string}
 */
module.exports.getAppVersion = function () {
  return pkg.version;
};

/**
 * Returns the application vender / author
 * 
 * @return {string}
 */
module.exports.getAppVendor = function () {
  return pkg.author;
};

/**
 * Returns the application description
 * 
 * @return {string}
 */
module.exports.getAppDescription = function () {
  return pkg.description;
};

module.exports.getBuildTimestamp = function () {
  return version.timestamp || 'unknown';
};
