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

const router = express.Router({
  caseSensitive: true,
  mergeParams: true,
  strict: true
});

// Endpoints

//
// GET: /show/databases
//
router.get('/show/databases', function (req, res) {
  executor.run(req, res, function () {
    /** @type {ShowDatabasesOptions} */
    const options = {
      pattern: req.query.pattern
    };
    executor.send(showDatabases.execute(options), res, 'databases');
  });
});

//
// Exports the router
module.exports = router;
