
[![Generator Express Restful MySQL](logo.png)](#icon-experience)

# Generator Express Restful MySQL

> Generates a express restful application with the mysql connection. It use the EM2015 Javascript.

This is a [Yeoman Generator][yeoman] generates a scaffolding for an application with a restful interface with express and mysql.

> Looking for the generator for ES5? The branch "generator-0-7" find here <https://github.com/blueskyfish/generator-express-restful-mysql/tree/generator-0.7>

**Note** This Yeoman Generator is still construction.

## Scaffolding

### Requirements

* [Node JS][nodejs] *Tested in version 6.x*
* [Yeoman][yeoman]

### Installation

* Check whether Node JS is installed in version 6.x or higher
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
  yo express-restful-mysql:app [options] [<userName>] [<company>]

Options:
  -h,   --help          # Print the generator's options and usage
        --skip-cache    # Do not remember prompt answers             Default: false
        --skip-install  # Do not automatically install dependencies  Default: false

Arguments:
  userName  # Your Github user name  Type: String  Required: false
  company   # Your Company           Type: String  Required: false
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
$ yo express-restful-mysql dummy
? Application Name simple-microservice
? Your Github name dummy
? Your Email Address dummy@example.com
? Abbreviation for your application simple
Summary:
   UserName:    dummy -> dummy
   UserEmail:   dummy@example.com
   Application: simple-microservice -> simpleMicroservice
   Shortcut:    simple -> Simple
   Github:      https://github.com/dummy/simple-microservice.git
Your project path: /playground/simple-microservice
   create package.json
   create .editorconfig
   create .gitignore
   create readme.md
   create logo.png
   create app/application.js
   create app/bootstrap.js
   create app/db.js
   create app/logger.js
   create app/middleware/measure.js
   create app/mysql/routing.js
   create app/mysql/service.js
   create app/shutdown.js
   create app/utils/args.js
   create app/utils/http.js
   create app/utils/info.js
   create server.js
   create man.txt
   create hero.txt
   create settings.example.json
   create jsdoc-config.json
   create apidoc.json
```

## Running

First: read the file `readme.md` in your project.

## History

Version  | date       | Description
---------|------------|--------------------
1.0.0    | 2017-04-08 | switch the javascript version to ES2015.
0.7.0    | 2017-04-07 | update the dependencies. set db#query(string, object) to deprecated. fixed transaction handling
0.6.1    | 2017-04-07 | clean up the source code of "db.js". Add some examples in the jsDoc. Set the module.export.query to deprecated, because this method is request an new connection every time.
0.6.0    | 2017-04-06 | add the transaction for the database service.
0.5.1    | 2016-10-10 | fixed the about endpoint (`buildTimestamp`) and remove the default server port. server port is required now!
0.5.0    | 2016-10-10 | add some improvements:<br> - fixed relative path names to absolute path names (hero)<br> - rename config property `logger.config` to `logger.namespaces`<br> - try to load the version.json for the about endpoint.
0.4.0    | 2016-09-16 | reedit the generator:<br> - generatore jsdoc and apidoc<br> - reedit the executer module: `executor.execute(req, res, function (sender) { sender(promise, propertyName); });`<br> - improve the logger messages.
0.3.3    | 2016-09-16 | update the dependency modules. Improve the readme.md
0.3.2    | 2016-09-03 | update the dependencies modules in the generator. Fixed some spellings.
0.3.1    | 2016-08-21 | fixed: copy missing the jsdoc-config.json
0.3.0    | 2016-08-20 | change the startup and the settings behaviours. add a mysql example
0.2.2    | 2016-07-21 | fixed readme property
0.2.1    | 2016-04-21 | fixed the db pool settings.
0.2.0    | 2016-04-19 | reedit the start phase and add an eventBus.
0.1.1    | 2016-04-13 | fixed some bugs and add the man.txt file for helping.
0.1.0    | 2016-03-17 | decouple the encrypt and decrypt call from the settings
0.0.2    |            | update readme file
0.0.1    |            | Initial publishing

## License

```
The MIT License (MIT)

Copyright (c) 2017 BlueSkyFish

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
