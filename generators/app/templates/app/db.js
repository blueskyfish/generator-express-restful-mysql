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
 * @requires module:<%= shortcut %>/utils/args
 * @requires module:<%= shortcut %>/logger
 */

'use strict';

const _      = require('lodash');
const mysql  = require('mysql');

const args   = require('app/utils/args');
const logger = require('app/logger').getLogger('<%= shortcut %>.db');

/**
 * The class **Conn** is a wrapper around the mysql connection.
 */
class Conn {

  /**
   * Creates an connection wrapper
   * @param {IConnection} conn
   */
  constructor(conn) {
    /**
     * @type {IConnection}
     */
    this.conn = conn;
  }

  /**
   * Executes the sql statement.
   * 
   * @param {string} sql the sql statement
   * @param {object} [values] the parameter entity
   * @return {Promise} the promise resolve callback has the result from the query.
   */
  query(sql, values) {
    return new Promise((resolve, reject) => {
      this.conn.query(sql, values, (err, rows) => {
        if (err) {
          return reject({
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
        resolve(rows);
      });
    });
  }

  /**
   * Executes the sql statement and returns the first element of the result.
   * 
   * @param {string} sql the sql statement
   * @param {object} values 
   * @param {*} [errMessage] when the result is not an array or has no elements, then it reject with the errMessage 
   */
  queryFirst(sql, values, errMessage) {
    return this.query(sql, values)
      .then((rows) => {
        if (row && _.isArray(rows) && _.size(row) > 0) {
          return rows[0];
        }
        return Promise.reject(errMessage);
      })
  }

  /**
   * Executes a sql statement within a transaction bracket.
   * 
   * **Example**
   * 
   * ```js
   * const db = require('app/db');
   * 
   * db.execute((conn) => {
   *    return conn.beginTransaction()
   *      .then(() => {
   *        // (1) put here the transaction needed sql statements
   *        return conn.query('INSERT INTO ....', values);
   *        // or multiple sql stements
   *        // Q.all([
   *        //    conn.query('INSERT INTO ...', values1),
   *        //    conn.query('INSERT INTO ...', values2)
   *        // ])
   *      })
   *      .then((result) => {
   *        // (2) result is routing through the commit
   *        return conn.commit(result)
   *      })
   *      .then((result) => {
   *        // (3) result of the sql statement from (1)
   *        return result.insertId;
   *      })
   *      .catch((reason) => {
   *        // (4) error reason is routing through the rollback
   *        return conn.rollback(reason);
   *      });
   *   });
   * ```
   * 
   * @return {Promise}
   */
  beginTransaction() {
    return new Promise((resolve, reject) => {
      this.conn.beginTransaction(function (err) {
        if (err) {
          return reject({
            code: 'TRANSACTION_FAILED',
            message: err.message || '?',
            errCode: err.code || 'Unknown Error!',
            errNumber: err.errno || -1,
            errStack: err.stack || '-',
            sqlState: err.sqlState || '-'
          });
        }
        logger.info('Begin transaction');
        resolve(true);
      });
    });
  };

  /**
   * Send a commit to the database.
   * 
   * In case of success, the given parameter "result" is routing to the resolve.
   * 
   * Example see at Conn#beginTransaction()
   * 
   * @param {*} result the query result from the former sql statement.
   * @return {Promise} resolve with the result
   */
  commit(result) {
    return new Promise((resolve, reject) => {
      this.conn.commit(function (err) {
        if (err) {
          reject({
            code: 'COMMIT_FAILED',
            message: err.message || '?',
            errCode: err.code || 'Unknown Error!',
            errNumber: err.errno || -1,
            errStack: err.stack || '-',
            sqlState: err.sqlState || '-'
          });
        }
        if (args.isVerbose()) {
          logger.info('commit transaction');
        }
        // routes with resolve the given result
        return resolve(result);
      });
    });
  }

  /**
   * Send a rollback to the database.
   * 
   * Example see at Conn#beginTransaction()
   *
   * @param {*} reason the query error from the former sql statement.
   * @return {Promise} reject with the reason
   *
   */
  rollback(reason) {
    return new Promise((resolve, reject) => {
      this.conn.rollback(function () {
        if (args.isVerbose()) {
          logger.info('rollback transaction');
        }
        // routes with rejection the given reason
        reject(reason);
      });
    });
  };

}

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
      host: _.get(settings, 'db.host', 'localhost'),
      port: _.get(settings, 'db.port', 3306),
      user: _.get(settings, 'db.user', 'root'),
      password: _.get(settings, 'db.password', '??'),
      database: _.get(settings, 'db.database', ''),
      connectionLimit: _.get(settings, 'db.connectionLimit', 10),
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
    require('app/shutdown').addListener((name) => {
      if (mPool && _.isFunction(mPool.end)) {
        mPool.end(() => { });
      }
      mPool = null;
      logger.info('pool is shutdown. Reason of "', name, '"...');
    });
  }
};


/**
 * Executes the callback function and returns an Promise result.
 * 
 * **Example**
 * 
 * ```js
 * db.execute((conn) => {
 *   return conn.beginTransaction()
 *     .then(() => {
 *       return conn.query('INSERT INTO ...');
 *     })
 *     .then((result) => {
 *       return conn.commit(result);
 *     })
 *     .catch(reason) => {
 *       return conn.rollback(reason);
 *     });
 * })
 * .then((result) => {
 *   console.log('ID %s', result.insertId);
 * });
 * ```
 * 
 * **2. Example**
 * 
 * ```js
 * db.execute((conn) => {
 *   return conn.query('SELECT * FROM ...', ...)
 *     .then((rows) => {
 *        return _groupingResult(rows);
 *     });
 * });
 * 
 * ExecuteFunction: `function (conn: Conn): Promise<*>`.
 *
 * @param {ExecuteFunction} callback
 * @return {Promise<*>}
 */
module.exports.execute = function (callback) {
  if (!mPool) {
    return Promise.reject({
      message: 'Initialize the database connection before using'
    });
  }

  if (!_.isFunction(callback)) {
    return Promise.reject({
      message: 'callback is not a function'
    });
  }

  // execute the callback function
  return new Promise((resolve, reject) => {
    // get the connection
    mPool.getConnection((err, conn) => {
      if (err) {
        return reject({
          message: 'connect is failed',
          errCode: err.code || 'Unknown Error!',
          errNumber: err.errno || -1,
          errStack: commons.splitting(err.stack || '-'),
          sqlState: err.sqlState || '-'
        });
      }

      // execute the callback, that returns a promise instance
      const result = callback(new Conn(conn));

      if (result && _.isFunction(result.then)) {
        // promise resolve or reject
        result.then((value) => {
          // close the connection and resolve
          conn.release();
          resolve(value);
        }, (reason) => {
          // close the connection and reject
          conn.release();
          reject(reason);
        });
        return;
      }

      conn.release();
      // execute with an error -> reject
      reject({
        message: 'Execute has not promise result'
      });
    });
  });
}
