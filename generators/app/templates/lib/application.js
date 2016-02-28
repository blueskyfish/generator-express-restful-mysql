/*
 * <%= appTitle %> - <%= githubUrl %>
 *
 * Copyright (c) <%= year %> <%= userName %>
 */

'use strict';

var bodyParser = require('body-parser');
var express = require('express');

var settings = require('./settings');

var logger = require('./logger')('<%= shortcut %>');

var app = express();

app.set('title', '<%= appTitle %>');

// Middlewares

// log every request
app.use(function (req, res, next) {
  var startTime = Date.now();
  var url = req.originalUrl;
  next();
  logger.debug('[APP] request "', url, '" in ', Date.now() - startTime, ' ms');
});

app.use(bodyParser.json());


// Router

// TODO Add your routers here


// Endpoint "/about"

app.get('/about', function (req, res) {
  res.send({
    name: settings.getAppName(),
    title: settings.getAppTitle(),
    version: settings.getAppVersion(),
    vendor: settings.getAppVendor(),
    description: settings.getAppDescription()
  });
});


// exports the express application
module.exports = app;
