/*
 * <%= appTitle %> - <%= githubUrl %>
 *
 * Copyright (c) <%= year %> <%= userName %>
 */

'use strict';

var crypto = require('crypto');

var ALGORITHM = 'aes-256-ctr';
var TEXT_ENCODE = 'utf8';
var CRYPT_ENCODE = 'hex';

var SALT = process.env["<%= appShort %>_SALT"] || "<%= appShort %>";

module.exports = {

  /**
   * Encrypt a value.
   *
   * @param {string} value the encrypted value / password
   * @param {string} [password] the optional password for encrypting.
   * @return {string} the encrypted value
   */
  encrypt: function (value, password) {
    return encrypt_(value, password);
  },

  /**
   * Decrypt a value
   * @param {string} value the decrypted value / password
   * @param {string} [password] the optional password for decrypting
   * @return {string} the decrypted value / password
   */
  decrypt: function (value, password) {
    return decrypt_(value, password);
  }
};

function encrypt_(value, password) {
  var cipher = crypto.createCipher(ALGORITHM, _getPassword(password));
  return cipher.update(value, TEXT_ENCODE, CRYPT_ENCODE) + cipher.final(CRYPT_ENCODE);
}

function decrypt_(value, password) {
  var decipher = crypto.createDecipher(ALGORITHM, _getPassword(password));
  return decipher.update(value, CRYPT_ENCODE, TEXT_ENCODE) + decipher.final(TEXT_ENCODE);
}

function _getPassword(password) {
  if (password || SALT) {
    return password || SALT;
  }
  throw new Error('Missing the password!');
}
