/*
 * <%= appTitle %> - <%= githubUrl %>
 *
 * Copyright (c) <%= year %> <%= userName %>
 */

'use strict';

var bodyParser = require('body-parser');
var express = require('express');

var duration = require('./duration');
var fs = require('./fs-then');
var info = require('./info');
var logger = require('./logger').getLogger('<%= shortcut %>');

var app = express();

app.set('title', info.getAppName);

// Middlewares

// measure the request time
app.use(duration.measureTime());

// parse preload into an json object.
app.use(bodyParser.json());


// Router

// TODO Add your routers here


// Endpoint "/about"

app.get('/about', function (req, res) {
  res.send({
    name: info.getAppName(),
    title: info.getAppTitle(),
    version: info.getAppVersion(),
    vendor: info.getAppVendor(),
    description: info.getAppDescription()
  });
});


// exports the express application
module.exports = app;
