/*
 * <%= appTitle %> - <%= githubUrl %>
 *
 * Copyright (c) <%= year %> <%= userName %>
 */

/**
 * The application of express.
 *
 * @module <%= shortcut %>/application
 *
 * @requires body-parser
 * @requires express
 * @requires q
 * @requires module:<%= shortcut %>/info
 * @requires module:<%= shortcut %>/config-util
 * @requires module:<%= shortcut %>/logger
 * @requires module:<%= shortcut %>/middleware
 * @requires module_<%= shortcut %>/router/mysql
 */

'use strict';

const bodyParser      = require('body-parser');
const express         = require('express');
const Q               = require('q');

const info            = require('app/info');
const configUtil      = require('app/config-util');
const logger          = require('app/logger').getLogger('<%= shortcut %>');

const middleware      = require('app/middleware');

const routerMySQL     = require('app/router/mysql');

const app = express();

const DEFAULT_PORT    = 40080;
const DEFAULT_HOST    = 'localhost';

/**
 * starts the application.
 *
 * @param {object} settings
 * @return {promise} the promise resolve callback is returns after the application is listening.
 */
module.exports.start = function (settings) {

  // add the config instance under "config".
  app.set('settings', settings);
  // set the application title
  app.set('title', info.getAppTitle());

  // --< Middlewares >---------------------------

  app.use(middleware.measureTime());

  app.use(bodyParser.json());

  // --< Routers >-------------------------------

  app.use('/mysql', routerMySQL);
  // TODO Add here the routers


  // --< Endpoints >-----------------------------

  // GET: "/about"
  app.get('/about', function about(req, res) {
    res.send({
      name: info.getAppName(),
      title: info.getAppTitle(),
      version: info.getAppVersion(),
      vendor: info.getAppVendor(),
      description: info.getAppDescription()
    });
  });

  // --< Starting >------------------------------

  // get the port and host
  const port = configUtil.getSetting(settings, 'server.port', DEFAULT_PORT);
  const host = configUtil.getSetting(settings, 'server.host', DEFAULT_HOST);

  const done = Q.defer();

  // starts the listening of the express application...
  app.listen(port, host, function () {
    logger.info('[<%= shortcut %>] Server is listen http://', host, ':', port);
    done.resolve(true);
  });

  return done.promise;
};
