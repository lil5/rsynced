[![NPM version][npm-image]][npm-url]
[![Build status][travis-image]][travis-url]
[![Lib dependences][libraries-dep-image]][libraries-dep-url]
[![Commits][gh-commits-image]][gh-commits-url]

# rsynconfig

> One config file for all rsync.

## Installation

npm: `npm i -g https://github.com/lil5/rsynconfig`

yarn: `yarn global add https://github.com/lil5/rsynconfig`

## Usage

> Run `rsynconfig -h` for more information about CLI arguments

### Example

Create `rsynconfig.toml` file into root of the project:

```toml
exclude = ['.rsync-filter']

[[destinations]]
name = 'sshtest'
src = './dir0/'
delete = false
flags = 'u'
[destinations.ssh.dest]
  host = 'localhost'
  user = 'lil'
  path = '/dir1/'
  key = './my.key'

[[destinations]]
name = 'localtest'
src = 'dir0'
dest = 'dir1'
delete = true
flags = 'dra'
```

### Run synchronization

```shell
rsynconfig run localtest

# dry run
rsynconfig dry localtest

# description can be a glob
rsynconfig run local*
```

### Create template 'rsynconfig.toml' file

```shell
rsynconfig init
```

## Not Another Markup Language (__[NAML](https://github.com/MarkTiedemann/naml)__)

Using `-c <filename>.<exten>` you can make your config file under the following extentions:
* json
* hjson
* json5
* cson
* yaml
* toml
* ini

## Nodejs Module

```javascript
const rsynconfig = require('rsynconfig')

rsynconfig(configFile, destinationsName, cwd)
.then((result) => {
  // result.names[...]
  // result.logs[...]
})
.catch(error => {
  if (error) {
    DEBUG
    ? console.error(error.message)
    : console.error(error.stack);
  }

  // ..
})
```

Globals are used for log verbosity
```
global.DEBUG = true
global.QUIET = true
```


## License

MIT.

[npm-image]: https://img.shields.io/npm/v/rsynconfig.svg
[npm-url]: https://www.npmjs.com/package/rsynconfig
[travis-image]: https://img.shields.io/travis/lil5/rsynconfig/master.svg
[travis-url]: https://travis-ci.org/lil5/rsynconfig
[libraries-dep-image]: https://img.shields.io/librariesio/github/lil5/rsynconfig.svg
[libraries-dep-url]: https://libraries.io/github/lil5/rsynconfig#dependencies
[gh-commits-image]: https://img.shields.io/github/last-commit/lil5/rsynconfig.svg
[gh-commits-url]: https://github.com/lil5/rsynconfig/commits/master
