/*
 * <%= appTitle %> - <%= githubUrl %>
 *
 * Copyright (c) <%= year %> <%= userName %>
 */

'use strict';

var mysql = require('mysql');
var Q = require('q');

var crypt    = require('./crypt');
var eventBus = require('./eventbus');
var phase    = require('./phase');
var settings = require('./settings');
var logger = require('./logger').getLogger('<%= shortcut %>.db');

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
 * @type {Pool}
 */
var mPool = mysql.createPool({
  host:     settings.getSetting('db.host', 'localhost'),
  port:     settings.getSetting('db.port', 3306),
  user:     settings.getSetting('db.user', 'root'),
  password: crypt.decrypt(settings.getSetting('db.password', 'test1234')),
  database: settings.getSetting('db.database', ''),
  connectionLimit: settings.getSetting('db.connectionLimit', 10),
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

// subscribe the event "phase.changed"
eventBus.subscribe('phase.changed', function () {
  if (phase.isShutdown()) {
    logger.info('[DB] shutdown: pool is closing');
    mPool.end();
  }
});

module.exports = {

  /**
   * Returns an open connection. In case of error a reason object is return in the promise reject callback.
   *
   * @return {promise} the promise resolve callback has the parameter from type {@link Conn}
   */
  getConnection: function () {
    return getConnection_();
  },

  /**
   * The query execute a sql statement.
   * @param {string} sql the sql statement
   * @param {object} [values] the parameter entity
   * @return {promise} the promise resolve callback has the array of rows from the query.
   */
  query: function (sql, values) {
    return query_(sql, values);
  }
};

function getConnection_() {
  var done = Q.defer();
  mPool.getConnection(function (err, conn) {
    if (err) {
      return done.reject({
        code: 'DB132',
        key: 'DATABASE.CONNECTION.ERROR',
        message: err.message || '?',
        errCode: err.code || 'Unknown Error!',
        errNumber: err.errno || -1,
        errStack: err.stack || '-',
        sqlState: err.sqlState || '-'
      });
    }
    done.resolve(new Conn(conn));
  });
  return done.promise;
}

function query_(sql, values) {
  var done = Q.defer();
  mPool.query(sql, values, function (err, rows) {
    _handleQueryFunc(done, err, rows);
  });
  return done.promise;
}


function _handleQueryFunc(done, err, rows) {
  if (err) {
    return done.reject({
      code: 'DB013',
      key: 'DATABASE.QUERY.ERROR',
      message: err.message || '?',
      errCode: err.code || 'Unknown Error!',
      errNumber: err.errno || -1,
      errStack: err.stack || '-',
      sqlState: err.sqlState || '-'
    });
  }
  logger.trace('[DB] query result: ', rows);
  done.resolve(rows);
}
