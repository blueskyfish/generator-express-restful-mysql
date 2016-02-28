
![Generator Express Restful MySQL](logo.png)

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
$ yo express-restful-mysql
? Application name monitoring-things
? Your Github name Dummy
? Your Email Address dummy@example.com
? Abbreviation for your application moth
Summary:
   UserName:    Dummy -> dummy
   UserEmail:   dummy@example.com
   Application: monitoring-things -> monitoringThings
   Shortcut:    moth -> MOTH
   Github:      https://github.com/dummy/monitoring-things.git
Target:  /Users/sarah/Projects/Kirchnerei/Playground/monitoring-things
Source:  /Users/sarah/Projects/Kirchnerei/Github/generator-exppress-restful-mysql/generators/app/templates
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
   create lib/logger.js
   create lib/settings.js
   create lib/shutdown.js
   create lib/startup.js
$
```

## Running

First: read the file `readme.md` in your project.


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

[yeoman]: http://yeoman.io/
[nodejs]: https://nodejs.com
