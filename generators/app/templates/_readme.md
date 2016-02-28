
![<%= appTitle %>](logo.png)

# <%= appTitle %>

> TODO summary description

_Generates with [Yeoman][yeoman]._

## TODOs

Some settings or replacement cannot be done with the generator. After doing this, you can delete this section.

* Choose a license (e.g: The MIT Licence).
* Set the version in the `package.json`.
* Replace the Logo (`logo.png`)
* Add a description into the `package.json` and to the summary of this readme file.
* Create a git repository with `$ git init` and add your git user information `$ git config user.name "<%= userName %>" && git config user.email "<%= userEmail %>"`
* Create a remote repository on [Github][github] with the name `<%= appName %>`. It should look after: `<%= githubUrl %>`

## Execute the application

First: exports the environment variables `<%= appShort %>_HOME` and `<%= appShort %>_SALT`.

```sh
$ npm index.js --port 3000 [--host localhost]
```


## Deployment

Deploying of the application needs some settings on the computer machine.

* Environment Variables
* Parameters
* Setting File

### Environment Variables

Name                | Type    | Required | Description
--------------------|---------|----------|--------------------------------------
`<%= appShort %>_HOME`         | string  | yes      | The Home directory of the **<%= appTitle %>**.
`<%= appShort %>_SALT`         | string  | yes      | The salt for encrypt or decrypt the (database) password.

### Parameters

Name                | Type    | Required | Description
--------------------|---------|----------|-------------------------------------------
`--port number`     | number  | yes      | The port for the server listening.
`--host domain`     | string  | no       | The host of the server. Default `localhost`.
`--help`            | boolean | no       | Shows the help

### Setting File

Database and other configurations are in a file `settings.json` in the folder of the `<%= appShort %>_HOME` environment.

> Note: The password for the database user is encrypted.

Name                | Type    | Default     | Description
--------------------|---------|-------------|------------------------------------------
`db.host`           | string  | `localhost` | The database host.
`db.port`           | number  | `3306`      | The database port.
`db.user`           | string  |             | The database user.
`db.password`       | string  |             | The encryted password for the database user.
`db.database`       | string  |             | The database name.
`stop.waiting`      | number  | `500`       | The waiting (in milliseconds) of sending the SIGKILL signal.
`logger.config`     | object  |             | The namespace configuration of the logger.
`logger.separator`  | string  | `.`         | The separator for the namespace.
`logger.appender`   | string  | `console`   | The appender setting (`console` or `file`).


**Eample:**

```json
{
  "db": {
    "port": 3306,
    "host": "localhost",
    "user": "database user",
    "password": "encrypted database password",
    "database": "datebase name",
    "connectionLimit": 10
  },
  "stop": {
    "waiting": 600
  },
  "logger": {
    "config": {
      "root": "info",
      "<%= shortcut %>": "debug",
      "<%= shortcut %>.db": "debug",
      "<%= shortcut %>.shutdown": "info"
    },
    "separator": ".",
    "appender": "console"
  }
}
```


## Home Directory

The application needs the environment variable `<%= appShort %>_HOME`. It shows the home directory of this application.

**Sub Directories**

* `logs` In this directory the log files are stored.


## Logging

There are 2 types as the log messages are written.

* `console`: The log messages are written to the console.
* `file`: The log messages are written into a file.

The setting `logger.appender` controls the writing of the log messages.

## Encryption

Some settings are encrypted. The environment variable `<%= appShort %>_SALT` contains the salt for the encryption or decryption.

### Encrypt a password

The script `encrypt.js` in the root directory of the project encrypt a value with the password. It does not use the environment variable `<%= appShort %>_SALT`.

```sh
$ node encypt.js password salt
```

### Decrypt a password

The script `decrypt.js` in the root directory of the project decrypt a value with the password. It does not use the environment variable `<%= appShort %>_SALT`.

```sh
$ node decrypt.js password salt
```


## License

```
TODO Choose a license
```


[github]: https://github.com
[yeoman]: http://yeoman.io
