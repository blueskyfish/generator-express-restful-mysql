/*
 * <%= appTitle %> - <%= githubUrl %>
 *
 * Copyright (c) <%= year %> <%= userName %>
 */

/**
 * Contains the information about the application. It is read from the package.json
 *
 * @module <%= shortcut %>/info
 *
 * @requires fs
 * @requires path
 */

'use strict';

const fs   = require('fs');
const path = require('path');

const pkg = require(path.join(__dirname, '..', 'package.json'));

var version = {};

//
// try to read the version.json file
//
fs.readFile(path.join(__dirname, '..', 'version.json'), 'utf-8', function (err, content) {
  if (!err) {
    try {
      version = JSON.parse(content);
    } catch (e) {
      //
    }
  }
});

module.exports.getAppName = function () {
  return pkg.name;
};

module.exports.getAppTitle = function () {
  return pkg.title;
};

module.exports.getAppVersion = function () {
  return pkg.version;
};

module.exports.getAppVendor = function () {
  return pkg.author;
};

module.exports.getAppDescription = function () {
  return pkg.description;
};


module.exports.getBuildTimestamp = function () {
  return version.timestamp || 'unknown';
};

/**
 * Prints the header information.
 *
 * @param {Logger} [logger] the logger for additional print out the header.
 */
module.exports.headerPrint = function (logger) {
  if (logger) {
    logger.info('"', pkg.title, '" (', pkg.version, ')');
    logger.info('');
    if (logger.isConsole) {
      return;
    }
  }
  console.info('%s (%s)', pkg.title, pkg.version);
  console.info('  %s', pkg.author);
  console.info('');
};
