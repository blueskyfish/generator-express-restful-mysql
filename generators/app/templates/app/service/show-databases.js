/*
 * <%= appTitle %> - <%= githubUrl %>
 *
 * Copyright (c) <%= year %> <%= userName %>
 */

/**
 * @module <%= shortcut %>/service/show-databases
 *
 * @requires module:<%= shortcut %>/args
 * @requires module:<%= shortcut %>/db
 * @requires module:<%= shortcut %>/logger
 */

'use strict';

const args   = require('app/args');
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
module.exports.execute = function (options) {
  return db.getConnection()
    .then(function (conn) {
      const pattern = _preparePattern(options.pattern);
      var sqlStatement = SQL_SHOW_DATABASES_ALL;
      var params = {};
      if (pattern) {
        params.pattern = pattern;
        sqlStatement = SQL_SHOW_DATABASES_WITH_PATTERN;
      }
      return conn.query(sqlStatement, params)
        .then(function (databases) {
          if (args.isVerbose()) {
            logger.debug('Your databases: ', JSON.stringify(databases));
          }
          return databases;
        })
        .finally(function () {
          // release the db connection
          conn.release();
        });
    });
};

/**
 * Prepare the pattern and replace all '
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
