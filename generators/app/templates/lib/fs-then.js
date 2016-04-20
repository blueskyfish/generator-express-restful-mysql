/*
 * <%= appTitle %> - <%= githubUrl %>
 *
 * Copyright (c) <%= year %> <%= userName %>
 */

'use strict';

var fs = require('fs');

var _ = require('lodash');
var Q = require('q');

var logger = require('./logger').getLogger('bicycle.fs');

module.exports = {

  /**
   * Read a file and the resolve callback has the parameter with the content of the file
   * 
   * @param {object} pathname the filename
   * @param {object|string} [options]
   * @return {promise}
   */
  readFile: function (pathname, options) {
    return readFile_(pathname, options);
  },

  /**
   * Write the content into a file and resolve callback is called, when done successfully.
   * @param {string} pathname
   * @param {string|number} content
   * @param {object|string} [options]
   * @return {promise}
   */
  writeFile: function (pathname, content, options) {
    return writeFile_(pathname, content, options);
  },
  
  sendFile: function (req, res, options) {
    sendFile_(req, res, options);
  }
};

function readFile_(pathname, options) {
  var done = Q.defer();
  
  fs.readFile(pathname, options, function (err, content) {
    if (err) {
      return done.reject(err);
    }
    done.resolve(content);
  });
  
  return done.promise;
}

function writeFile_(pathname, content, options) {
  var done = Q.defer();
  
  fs.writeFile(pathname, content, options, function (err) {
    if (err) {
      return done.reject(err);
    }
    done.resolve();
  });
  return done.promise;
}

function sendFile_(req, res, options) {
  var url = req.originalUrl;
  if (url === '/') {
    url = '/index.html';
  }
  var pathname = './docs/html' + url;
  readFile_(pathname, options)
    .then(function (content) {
      res.send(content);
    }, function (reason) {
      if (!_.isString(reason)) {
        reason = JSON.stringify(reason);
      }
      logger.warn('404: not found "', url, '" -> ', reason);
      res.status(404).end();
    });
}
