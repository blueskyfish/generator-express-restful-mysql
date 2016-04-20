
[![Generator Express Restful MySQL](logo.png)](#icon-experience)

# Generator Express Restful MySQL

> Generates a express restful application with the mysql connection

This is a [Yeoman Generator][yeoman] generates a scaffolding for an application with a restful interface with express and mysql.

**Note** This Yeoman Generator is still construction.

## Scaffolding

### Requirements

* [Node JS][nodejs]
* [Yeoman][yeoman]

### Installation

* Check whether Node JS is installed
* Install the Yeoman global
* Install this generator

```sh
$ npm install -g yo
$ npm install -g generator-express-restful-mysql
```

### Help

```sh
$ yo express-restful-mysql --help

Usage:
  yo express-restful-mysql:app [options] [<userName>]

Options:
  -h,   --help          # Print the generator's options and usage
        --skip-cache    # Do not remember prompt answers             Default: false
        --skip-install  # Do not automatically install dependencies  Default: false

Arguments:
  userName  # Your Github user name  Type: String  Required: false
```

## Usage

* Create a project directory
* Call the yeoman generator
* Answer some question
	* Application name (default is the basename of the project directory)
	* UserName (default is the username from the arguments
	* UserEmail
	* Shortcut of the application
* Install the node dependencies

```sh
$ mkdir -p /path/to/your/new/project
$ cd /path/to/your/new/project
$ yo express-restful-mysql ["Github UserName"]
$ npm install
```

**Example:**

```sh
$ yo express-restful-mysql Dummy
? Application name test-app
? Your Github name Dummy
? Your Email Address dummy@example.com
? Abbreviation for your application test
Summary:
   UserName:    Dummy -> dummy
   UserEmail:   dummy@example.com
   Application: test-app -> testApp
   Shortcut:    test -> TEST
   Github:      https://github.com/dummy/test-app.git
Your project path: /path/to/project/test-app
   create package.json
   create .editorconfig
   create .gitignore
   create readme.md
   create logo.png
   create decrypt.js
   create encrypt.js
   create index.js
   create lib/application.js
   create lib/crypt.js
   create lib/db.js
   create lib/duration.js
   create lib/eventbus.js
   create lib/fs-then.js
   create lib/info.js
   create lib/logger.js
   create lib/phase.js
   create lib/runner.js
   create lib/settings.js
```

## Running

First: read the file `readme.md` in your project.

## History

Version  | date       | Description
---------|------------|--------------------
0.2.0    | 2016-04-19 | reedit the start phase and add an eventBus.
0.1.1    | 2016-04-13 | fixed some bugs and add the man.txt file for helping.
0.1.0    | 2016-03-17 | decouple the encrypt and decrypt call from the settings
0.0.2    |            | update readme file
0.0.1    |            | Initial publishing

## License

```
The MIT License (MIT)

Copyright (c) 2016 BlueSkyFish

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

<a name="icon-experience"></a> Logo's of [Icon Experience][iconexperience]

[yeoman]: http://yeoman.io/
[nodejs]: https://nodejs.com
[iconexperience]: https://www.iconexperience.com/o_collection
