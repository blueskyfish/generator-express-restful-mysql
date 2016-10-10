
![<%= appTitle %>](logo.png)

# <%= appTitle %>

> TODO add here summary description

_Generates with [Yeoman][yeoman] and the generator <https://github.com/blueskyfish/generator-express-restful-mysql.git>._

## Table of Content

* [TODOs](#user-content-todos)
* [Execute the Application](#user-content-execute-the-application)
* [Endpoints](#user-content-endpoints)
* [Deployment](#user-content-deployment)
	* [Parameters](#user-content-parameters)
	* [Setting File](#user-content-setting-file)
* [Home Directory](#user-content-home-directory)
* [Logging](#user-content-logging)
* [Generate Documentation](#user-content-generate-documentation)
* [License](#user-content-license)

## TODOs

Some settings or replacement cannot be done with the generator. After doing this, you can delete this section.

* Choose a license (e.g: The MIT Licence).
* Set the version in the `package.json`.
* Replace the Logo (`logo.png`).
* Replace with own hero ascii art _(example: <http://patorjk.com/software/taag/>)_ (`hero.txt`).
* Add a description into the `package.json` and to the summary of this readme file.
* Execute `$ npm install` to resolve and load the dependencies.
* Create a git repository with `$ git init` and add your git user information `$ git config user.name "<%= userName %>" && git config user.email "<%= userEmail %>"`
* Create a remote repository on [Github][github] with the name `<%= appName %>`. It should look after: `<%= githubUrl %>`

## Execute the Application

```sh
$ node server.js [--verbose | -v] [--help] --config=/path/to/configuration.json
```

## Endpoints

There are 2 endpoints after starting the application.

* `/about`
* `/mysql/show/databases`

> **Note**: If the tool `apidoc` is installed, you can view the documentation on Endpoints in directory `apidoc`: call `npm run apidoc`.


## Deployment

Deploying of the application needs some settings on the computer machine.

* Parameters
* Setting File

### Parameters

Name                      | Type    | Required | Description
--------------------------|---------|----------|-------------------------------------------
`--verbose` | `-v`        | boolean | no       | Show more logging messages
`--help`                  | boolean | no       | Shows the help
`--log=/path/of/loggging` | string  | yes      | Contains the directory how the log messages are written.
`--config=/path/to`       | string  | yes      | The filename with the path to the configuration json file.


### Setting File

> An Example of the settings is finding at `settings.example.json`

Name                | Type    | Default     | Description
--------------------|---------|-------------|------------------------------------------
`server.host`       | string  | `localhost` | The server host for listening.
`server.port`       | number  |             | The server port for listening. The server port is required now!
`db.host`           | string  | `localhost` | The database host.
`db.port`           | number  | `3306`      | The database port.
`db.user`           | string  |             | The database user.
`db.password`       | string  |             | The password for the database user.
`db.database`       | string  |             | The database name.
`logger.namespaces` | object  |             | The namespace configuration of the logger.
`logger.separator`  | string  | `.`         | The separator for the namespace.
`logger.appender`   | string  | `console`   | The appender setting (`console` or `file`).


**Example:**

```json
{
    "server": {
        "host": "127.0.0.1",
        "port": 65001
    },
    "db": {
        "port": 3306,
        "host": "localhost",
        "user": "database user",
        "password": "database password",
        "database": "datebase name",
        "connectionLimit": 10
    },
    "logger": {
        "namespaces": {
            "root": "info",
            "temo": "debug",
            "temo.db": "debug",
            "temo.shutdown": "info"
        },
        "separator": ".",
        "appender": "console"
    }
}
```


## Home Directory

The home directory is calculated from the configuration filename.

*Note: The pid file is written in the home directory!*

**Sub Directories**

* `logs` The log files are stored in this directory.


## Logging

There are 2 types as the log messages are written.

* `console`: The log messages are written to the console.
* `file`: The log messages are written into a file.

The setting `logger.appender` controls the writing of the log messages. The parameter `--log` specifies path name where the log messages are written.

## Generate Documentation

There are to commands for generating the jsDoc and the apidoc for the endpoints:

* jsDoc: `npm run jsdoc` generates the jsdoc in the directory `jsdoc`
* apidoc: `npm run apidoc` generates the apidoc of the endpoints in the directory `apidoc`.

**Steps**

```sh
$ npm run jsdoc
$ npm run apidoc
```


## License

```
TODO Choose a license
```


[github]: https://github.com
[yeoman]: http://yeoman.io
