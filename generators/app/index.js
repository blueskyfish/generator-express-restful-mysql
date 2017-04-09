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
var Generator = require('yeoman-generator');
var moment = require('moment');

module.exports = class extends Generator {

  constructor(args, opts) {
    super(args, opts);

    this.argument('userName', { type: String, required: false, optional: true, desc: 'Your Github user name'});
    this.argument('company', { type : String, required: false, optional: true, desc: 'Your Company'});
  }

  prompting () {
    const defaultEmail = this.userName && this.company ? this.userName + '@' + this.company + '.com' : '';
    return this.prompt([
      {
        type: 'input',
        name: 'appName',
        message: 'Application Name',
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
        message: 'Your Email Address',
        default: defaultEmail
      },
      {
        type: 'input',
        name: 'shortcut',
        message: 'Abbreviation for your application',
        default: this._abbreviation(path.basename(process.cwd()))
      }
    ]).then((answers) => {
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
    });
  }

  paths () {
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
    // copy logo
    this.fs.copy(
      this._from('logo.png'),
      this._to('logo.png')
    );
    // copy all javascript files
    this.fs.copyTpl(
      this._from('**/*.js'),
      this._to(),
      model
    );
    // copy man page
    this.fs.copyTpl(
      this._from('man.txt'),
      this._to('man.txt'),
      model
    );
    // copy hero ascii art
    this.fs.copyTpl(
      this._from('hero.txt'),
      this._to('hero.txt'),
      model
    );
    // copy example of settings.json
    this.fs.copyTpl(
      this._from('settings.example.json'),
      this._to('settings.example.json'),
      model
    );
    // copy jsdoc-config.json
    this.fs.copyTpl(
      this._from('jsdoc-config.json'),
      this._to('jsdoc-config.json'),
      model
    );
    // copy apidoc.json
    this.fs.copyTpl(
      this._from('apidoc.json'),
      this._to('apidoc.json'),
      model
    );
  }

  _from(filename) {
    return this.templatePath(filename);
  }

  _to(filename) {
    if (filename) {
      return this.destinationPath(filename);
    }
    return this.destinationRoot();
  }

  _abbreviation(name) {
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
};
