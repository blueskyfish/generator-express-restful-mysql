/*
 * Generator Express Restful MySQL - https://github.com/blueskyfish/generator-express-restful-mysql.git
 *
 * The MIT License (MIT)
 * Copyright (c) 2016 BlueSkyFish
 */

'use strict';

var path = require('path');
var util = require('util');

var _ = require('lodash');
var generators = require('yeoman-generator');
var moment = require('moment');

module.exports = generators.Base.extend({

  constructor: function () {
    generators.Base.apply(this, arguments);

     this.argument('userName', { type: String, required: false, optional: true, desc: 'Your Github user name'});
  },

  prompting: function () {
    var done = this.async();
    this.prompt([
      {
        type: 'input',
        name: 'appName',
        message: 'Application name',
        default: path.basename(process.cwd())
      },
      {
        type: 'input',
        name: 'userName',
        message: 'Your Github name',
        default: this.userName
      },
      {
        type: 'input',
        name: 'userEmail',
        message: 'Your Email Address'
      },
      {
        type: 'input',
        name: 'shortcut',
        message: 'Abbreviation for your application',
        default: this._abbreviation(path.basename(process.cwd()))
      }
    ], function (answers) {
      this.userLowerName = answers.userName.toLowerCase();
      this.userName = answers.userName;
      this.userEmail = answers.userEmail;
      this.appTitle = _.camelCase(answers.appName);
      this.appName = _.kebabCase(answers.appName);
      this.githubUrl = util.format('https://github.com/%s/%s.git', this.userLowerName, this.appName);
      this.shortcut = answers.shortcut;
      this.appShort = answers.shortcut.toUpperCase();
      this.log('Summary:');
      this.log('   UserName:    %s -> %s', this.userName, this.userLowerName);
      this.log('   UserEmail:   %s', this.userEmail);
      this.log('   Application: %s -> %s', this.appName, this.appTitle);
      this.log('   Shortcut:    %s -> %s', this.shortcut, this.appShort);
      this.log('   Github:      %s', this.githubUrl);
      done();
    }.bind(this));
  },


  paths: function () {
    this.log('Your project path: %s', this.destinationPath());
    var now = moment();

    var model = {
      appTitle: this.appTitle,
      appName: this.appName,
      appShort: this.appShort,
      userName: this.userName,
      userEmail: this.userEmail,
      githubUser: this.userLowerName,
      githubUrl: this.githubUrl,
      shortcut: this.shortcut,
      year: now.format('YYYY')
    };

    this.fs.copyTpl(
      this._from('_editorconfig'),
      this._to('.editorconfig'),
      model
    );
    this.fs.copyTpl(
      this._from('_gitignore'),
      this._to('.gitignore'),
      model
    );
    this.fs.copyTpl(
      this._from('_readme.md'),
      this._to('readme.md'),
      model
    );
    this.fs.copyTpl(
      this._from('_package.json'),
      this._to('package.json'),
      model
    );

    this.fs.copy(
      this._from('logo.png'),
      this._to('logo.png')
    );

    this.fs.copyTpl(
      this._from('**/*.js'),
      this._to(),
      model
    );
  },

  _from: function (filename) {
    return this.templatePath(filename);
  },

  _to: function (filename) {
    if (filename) {
      return this.destinationPath(filename);
    }
    return this.destinationRoot();
  },

  _abbreviation: function (name) {
    var temp = _.kebabCase(name);
    var abb = '';
    for (var index = 0; index < temp.length; index++) {
      if (index === 0) {
        abb += temp.charAt(index);
        continue;
      }
      if ('-_.+#'.indexOf(temp.charAt(index)) >= 0) {
        abb += temp.charAt(index + 1) || '?';
      }
    }
    return abb;
  }
});
