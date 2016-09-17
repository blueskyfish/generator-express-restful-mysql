/*
 * <%= appTitle %> - <%= githubUrl %>
 *
 * Copyright (c) <%= year %> <%= userName %>
 */

/**
 * @module <%= shortcut %>/router/mysql
 *
 * @requires express
 * @requires <%= shortcut %>/executor
 * @requires <%= shortcut %>/service/show-databases
 */

'use strict';

const express = require('express');

const executor      = require('app/executor');
const showDatabases = require('app/service/show-databases');

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
 * @apiSuccess {[]String} database the array with the database names.
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
  executor.execute(req, res, function (sender) {
    /** @type {ShowDatabasesOptions} */
    const options = {
      pattern: req.query.pattern
    };
    sender(showDatabases.execute(options), 'databases');
  });
});

//
// Exports the router
//
module.exports = router;
