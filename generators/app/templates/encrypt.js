/*
 * <%= appTitle %> - <%= githubUrl %>
 *
 * Copyright (c) <%= year %> <%= userName %>
 */

'use strict';

var crypt = require('./lib/crypt');
var info = require('./lib/info');

var params = process.argv.slice(2);

info.showHeader();

if (params.length === 0) {
  usage_();
} else {
  encrypt(params[0], params[1]);
}

function usage_() {
  console.info('Usage:');
  console.info('  $ node encrypt.js value password');
  process.exit(0);
}

function encrypt(value, password) {
  var text = crypt.encrypt(value, password);
  console.info('  %s => %s', value, text);
  console.info('');
}
