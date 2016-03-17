/*
 * <%= appTitle %> - <%= githubUrl %>
 *
 * Copyright (c) <%= year %> <%= userName %>
 */

'use strict';

var pkg = require('../package.json');

module.exports = {

  getAppName: function () {
    return pkg.name;
  },

  getAppTitle: function () {
    return pkg.title;
  },

  getAppVersion: function () {
    return pkg.version;
  },

  getAppVendor: function () {
    return pkg.author;
  },

  getAppDescription: function () {
    return pkg.description;
  }
};
