/*
 * <%= appTitle %> - <%= githubUrl %>
 *
 * Copyright (c) <%= year %> <%= userName %>
 */

'use strict';

var crypt = require('./lib/crypt');
var info = require('./lib/info');

var params = process.argv.slice(2);

header_();

if (params.length === 0) {
  usage_();
} else {
  decrypt(params[0], params[1]);
}

function header_() {
  console.info('');
  console.info('%s (%s)', info.getAppTitle(), info.getAppVersion());
  console.info('  %s', info.getAppVendor());
  console.info('');
}

function usage_() {
  console.info('Usage:');
  console.info('  $ node decrypt.js value password');
  process.exit(0);
}

function decrypt(value, password) {
  var text = crypt.decrypt(value, password);
  console.info('  %s => %s', value, text);
  console.info('');
}
