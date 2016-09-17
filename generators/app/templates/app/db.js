/*
 * <%= appTitle %> - <%= githubUrl %>
 *
 * Copyright (c) <%= year %> <%= userName %>
 */

/**
 * Handle all database manipulations
 *
 * @module <%= shortcut %>/db
 *
 * @requires lodash
 * @requires mysql
 * @requires q
 * @requires module:<%= shortcut %>/args
 * @requires module:<%= shortcut %>/config-util
 * @requires module:<%= shortcut %>/logger
 */

'use strict';

const _     = require('lodash');
const mysql = require('mysql');
const Q     = require('q');

const args       = require('app/args');
const configUtil = require('app/config-util');
const logger     = require('app/logger').getLogger('<%= shortcut %>.db');


/**
 * Creates an connection wrapper
 * @param {PoolConnection} conn
 * @constructor
 */
function Conn(conn) {
  /**
   * @type {PoolConnection}
   */
  this.conn = conn;
}

/**
 *
 * @param {string} sql the sql statement
 * @param {object} [values] the parameter entity
 * @return {Q.promise} the promise resolve callback has the array of rows from the query.
 */
Conn.prototype.query = function (sql, values) {
  var done = Q.defer();
  this.conn.query(sql, values, function (err, rows) {
    _handleQueryFunc(done, err, rows);
  });
  return done.promise;
};

/**
 * Release the connection
 */
Conn.prototype.release = function () {
  this.conn.release();
};

/**
 * @type {Pool|null}
 */
var mPool = null;

/**
 * start - Try to initialize the database connection pool!
 *
 * @param {object} settings the settings instance.
 */
module.exports.start = function (settings) {
  if (!mPool) {
    logger.info('create connection pool.');
    mPool = mysql.createPool({
      host:     configUtil.getSetting(settings, 'db.host', 'localhost'),
      port:     configUtil.getSetting(settings, 'db.port', 3306),
      user:     configUtil.getSetting(settings, 'db.user', 'root'),
      password: configUtil.getSetting(settings, 'db.password', 'test1234'),
      database: configUtil.getSetting(settings, 'db.database', ''),
      connectionLimit: configUtil.getSetting(settings, 'db.connectionLimit', 10),
      queryFormat: function (query, values) {
        if (!values) {
          // without a value object
          return query;
        }
        return query.replace(/\{(\w+)}/g, function (text, key) {
          if (values.hasOwnProperty(key)) {
            return mPool.escape(values[key]);
          }
          return text;
        });
      }
    });
    logger.info('add the shutdown callback for close the connection pool...');
    require('app/shutdown').addListener(function (name) {
      if (mPool && _.isFunction(mPool.end)) {
        mPool.end(function () {});
      }
      mPool = null;
      logger.info('pool is shutdown. Reason of "', name, '"...');
    });
  }
};

/**
 * Returns an open connection. In case of error a reason object is return in the promise reject callback.
 *
 * @return {promise} the promise resolve callback has the parameter from type {@link Conn}
 */
module.exports.getConnection = function () {
  if (!mPool) {
    return Q.reject({
      code: 'CONN_NOT_INITIALIZED',
      message: 'The mysql connection pool is not initialized!'
    });
  }

  const done = Q.defer();
  mPool.getConnection(function (err, conn) {
    if (err) {
      return done.reject({
        code: 'CONN_REFUSED',
        message: 'Could not establish a connection to the database server',
        error: err.message || err
      });
    }

    // TODO If you want to set the timezone!
    // conn.query('SET time_zone = \'+0:00\';', function (err, result) {
    //   if (err) {
    //     logger.warn('[database] TimeZone: ', JSON.stringify(err));
    //   }
    //   done.resolve(new Conn(conn));
    // });
    // TODO if you not want to set the timezone!
    done.resolve(new Conn(conn));
  });
  return done.promise;
};

/**
 * The query execute a sql statement.
 * @param {string} sql the sql statement
 * @param {object} [values] the parameter entity
 * @return {Q.promise} the promise resolve callback has the array of rows from the query.
 */
module.exports.query = function (sql, values) {
  const done = Q.defer();
  mPool.query(sql, values, function (err, rows) {
    _handleQueryFunc(done, err, rows);
  });
  return done.promise;
};

//
// process the result of a query.
//
function _handleQueryFunc(done, err, rows) {
  if (err) {
    return done.reject({
      code: 'QUERY_FAILED',
      message: err.message || '?',
      errCode: err.code || 'Unknown Error!',
      errNumber: err.errno || -1,
      errStack: err.stack || '-',
      sqlState: err.sqlState || '-'
    });
  }
  if (args.isVerbose()) {
    logger.trace('[DB] query result: ', rows);
  }
  done.resolve(rows);
}
