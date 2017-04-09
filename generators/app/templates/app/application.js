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
 * @requires lodash
 * @requires body-parser
 * @requires express
 * @requires module:<%= shortcut %>/info
 * @requires module:<%= shortcut %>/config-util
 * @requires module:<%= shortcut %>/logger
 * @requires module:<%= shortcut %>/middleware/measure
 * @requires module:<%= shortcut %>/router/mysql
 */

'use strict';

const _               = require('lodash');
const bodyParser      = require('body-parser');
const express         = require('express');

const info            = require('app/info');
const logger          = require('app/logger').getLogger('<%= shortcut %>');

const measureTime     = require('app/middleware/measure');

const mysqlRouting    = require('app/mysql/mysql-outing');

const app = express();

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

  //
  // Middlewares...
  //
  app.use(measureTime());

  app.use(bodyParser.json());

  // Routing

  app.use('/mysql', mysqlRouting);

  // TODO Add here your routers


  // Endpoints...

  /**
   * @api {get} /about About
   * @apiName GetAbout
   * @apiGroup System
   * @apiDescription Shows the information about the application
   * @apiVersion 0.0.1
   * @apiExample {curl} Example usage:
   *     curl -i http://localhost:18080/about
   *
   * @apiSuccess {String} name the application name
   * @apiSuccess {String} title the title of the application
   * @apiSuccess {String} version the version of the application
   * @apiSuccess {String} vendor the author / company of the application
   * @apiSuccess {String} description a short description.
   *
   * @apiSuccessExample {json} Success response:
   *     HTTP/1.1 200 OK
   *     {
   *       "name": "dummy-rest",
   *       "title": "Dummy Rest Interface",
   *       "version": "0.0.1",
   *       "vendor": "Dummy <dummy@example.com>",
   *       "description": "This is a dummy service",
   *       "build": "20161004-133401"
   *     }
   */
  app.get('/about', function about(req, res) {
    res.send({
      name: info.getAppName(),
      title: info.getAppTitle(),
      version: info.getAppVersion(),
      vendor: info.getAppVendor(),
      description: info.getAppDescription(),
      build: info.getBuildTimestamp()
    });
  });

  // Starting...

  // get the port and host
  const port = _.get(settings, 'server.port', 0);
  const host = _.get(settings, 'server.host', DEFAULT_HOST);

  return new Promise((resolve, reject) => {
    if (port > 0) {
      // starts the listening of the express application...
      app.listen(port, host, function () {
        logger.info('Server is listen http://', host, ':', port);
        resolve(true);
      });
    } else {
      // missing the port for the server...
      process.nextTick(function () {
        reject({
          code: 'MISSING_PORT',
          message: 'Missing the setting property "server.port"!'
        });
      });
    }

  });
};
