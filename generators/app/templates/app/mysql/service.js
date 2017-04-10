/*
 * <%= appTitle %> - <%= githubUrl %>
 *
 * Copyright (c) <%= year %> <%= userName %>
 */

/**
 * @module <%= shortcut %>/mysql/service
 *
 * @requires lodash
 * @requires module:<%= shortcut %>/utils/args
 * @requires module:<%= shortcut %>/db
 * @requires module:<%= shortcut %>/logger
 */

'use strict';

const _      = require('lodash');

const args   = require('app/utils/args');
const db     = require('app/db');
const logger = require('app/logger').getLogger('<%= shortcut %>.service');

/**
 * @name ShowDatabasesOptions
 * @property {string} [pattern] the search pattern
 */

/**
 * Statement for databases matched with pattern
 * @type {string}
 */
const SQL_SHOW_DATABASES_WITH_PATTERN = [
  'SHOW DATABASES',
  'LIKE {pattern}'
].join('\n');

/**
 * Statement for all databases.
 * @type {string}
 */
const SQL_SHOW_DATABASES_ALL = [
  'SHOW DATABASES'
].join('\n');

/**
 *
 * @param {ShowDatabasesOptions} options
 * @return {promise} the promise resolve callback has the parameter, that has all databases from mysql server.
 */
module.exports.getDatabaseList = function (options) {
  return db.execute((conn) => {
    const pattern = _preparePattern(options.pattern);
    let sqlStatement = SQL_SHOW_DATABASES_ALL;
    let params = {};
    if (pattern) {
      params.pattern = pattern;
      sqlStatement = SQL_SHOW_DATABASES_WITH_PATTERN;
    }
    return conn.query(sqlStatement, params)
      .then((databases) => {
        return _mapDatabases(databases);
      });
  });
};

/**
 * Prepare the pattern and replace all * to %.
 * 
 * @param {string|null} pattern the like pattern
 * @return {string|null}
 * @private
 */
function _preparePattern(pattern) {
  if (!pattern) {
    return null;
  }
  return pattern.replace(/\*/g, '%');
}

/**
 * Maps the rows of database and returns a list with the database name.
 * 
 * @param {object[]} databases
 * @return {string[]} 
 * @private
 */
function _mapDatabases(databases) {
  if (args.isVerbose()) {
    logger.debug('Your databases: ', JSON.stringify(databases));
  }
  let result = [];
  _.forEach(databases, function (db) {
    const name = _.values(db)[0];
    result.push(name);
  });
  return result; 
}
