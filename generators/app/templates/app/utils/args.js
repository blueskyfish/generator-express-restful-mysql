/*
 * <%= appTitle %> - <%= githubUrl %>
 *
 * Copyright (c) <%= year %> <%= userName %>
 *
 * Purpose:
 */

/**
 * Read the cli arguments
 *
 * ```
 * -v | --verbose     show the debug and trace messages
 * --help             show the man page of the application and exit.
 * --config=pathname  the pathname to the configuration file.
 * --log=pathname     the pathname to the log files and the place of the pid file
 * ```
 *
 * @module <%= shortcut %>/utils/args
 *
 * @requires minimist
 */

'use strict';

const minimist = require('minimist');

const mParams = minimist(process.argv.slice(2));
const mVerbose = mParams.verbose || mParams.v || false;
const mHelp = mParams.help || false;


/**
 * Is manages the verbose messages
 *
 * @return {boolean}
 */
module.exports.isVerbose = function () {
  return mVerbose;
};

/**
 * Application should show the help messages when the argument is `--help`
 *
 * @return {boolean}
 */
module.exports.isHelp = function () {
  return mHelp;
};

/**
 * Returns the filename of the configuration.
 *
 * @return {string|null} the filename to the configuration
 */
module.exports.getConfigFilename = function () {
  return mParams.config || null;
};

/**
 * Returns the path to the log files and the place of the pid file
 *
 * @return {String|null} the path or null
 */
module.exports.getLogPath = function () {
  return mParams.log || null;
};
