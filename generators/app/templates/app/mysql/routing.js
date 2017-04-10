/*
 * <%= appTitle %> - <%= githubUrl %>
 *
 * Copyright (c) <%= year %> <%= userName %>
 */

/**
 * @module <%= shortcut %>/mysql/routing
 * @description
 * Routing methods for mysql.
 *
 * @requires express
 * @requires <%= shortcut %>/utils/http
 * @requires <%= shortcut %>/mysql/service
 */

'use strict';

const express      = require('express');

const httpUtil     = require('app/utils/http');
const mysqlService = require('app/mysql/service');

//
// Router: /mysql
//
const router = express.Router({
  caseSensitive: true,
  mergeParams: true,
  strict: true
});

//
// Endpoints...
//

/**
 * @api {get} /mysql/show/databases Get Databases
 * @apiName GetDatabases
 * @apiGroup Mysql
 * @apiDescription Returns a list of database
 * @apiParam {String} [pattern] a filter pattern. All `*`is replaced with `%`.
 * @apiVersion 0.0.1
 * @apiExample {curl} Example usage:
 *     curl -i http://localhost:18080/mysql/show/databases
 *     curl -i http://localhost:18080/mysql/show/databases?pattern=Test*DB
 *
 * @apiSuccess {String} status always `okay`
 * @apiSuccess {[]String} databases the array with the database names.
 *
 * @apiSuccessExample {json} Success response
 *     HTTP/1.1 200 OK
 *     {
 *       "status": "okay",
 *       "databases": [
 *          "database1",
 *          "database2",
 *          "database3"
 *       ]
 *     }
 */
router.get('/show/databases', function (req, res) {
  /** @type {ShowDatabasesOptions} */
  const options = {
    pattern: req.query.pattern
  };
  httpUtil.sendResult(req, res, mysqlService.getDatabaseList(options), 'databases');
});

//
// Exports the router
//
module.exports = router;
