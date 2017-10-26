[![NPM version][npm-image]][npm-url]
[![Build status][travis-image]][travis-url]
[![Lib dependences][libraries-dep-image]][libraries-dep-url]
[![Commits][gh-commits-image]][gh-commits-url]
[![License][gh-license-image]][gh-license-url]

# rsynconfig

> One config file for all rsync.

## Installation

npm: `npm i -g rsynconfig`

yarn: `yarn global add rsynconfig`

make: `make` > [* uses npm under the hood*](https://github.com/lil5/rsynconfig/blob/master/Makefile)

## Usage

> Run `rsynconfig -h` for more information about CLI arguments

### Create template '.rsynconfig.toml' file

```shell
rsynconfig init
```

### Example

Edit or create `.rsynconfig.toml` file into root of the project:

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
src = 'dir0/'
dest = 'dir1/'
delete = true
flags = 'dra'
```

#### Examples by others
* lil5 [link](https://gist.github.com/lil5/e358559a36da149f51262b7113287719)

> Please contact me I would love to have more examples.

### Run synchronization

```shell
rsynconfig run localtest

# dry run
rsynconfig dry localtest

# name can be a glob to run multiple
rsynconfig run *test

# async run
# possibly handy for remote synchronization with large files
rsynconfig async localtest

# restore
# restore files from given dest to src
# delete is always false; flags is 'a'
rsynconfig restore localtest
```

### Config file options

|name|type(s)|default|description|example value (.toml)|
|----|-------|-------|-----------|-------------|
|`name`|`String`||name of destination in destinations array|`[[destinations]]`¬ `name = 'test'`|
|`src`|`String`||local rsync source|`src = '/media/$USER/data/test/'`|
|`dest`|`String`||local rsync destination|`dest = '$HOME/test/'`|
|`ssh.(dest/src).host`|`String`||ssh host|`[destinations.ssh.dest]`¬ `host = 'localhost'`|
|`ssh.(dest/src).user`|`String`||ssh user|`[destinations.ssh.dest]`¬ `user = 'alex'`|
|`ssh.(dest/src).path`|`String`||ssh root path|`[destinations.ssh.dest]`¬ `path = '/www'`|
|`ssh.(dest/src).key`|`String`||ssh optional key|`[destinations.ssh.dest]`¬ `key = '$HOME/ssh.key'`|
|`flags`|`Boolean`|`dr`|rsync flags|`flags = 'au'`|
|`delete`|`Boolean`|`false`|delete flag|`delete = true`|
|`exclude`|`String` or `Array`||exclude files|`exclude = ['/A*']`|
|`include`|`String` or `Array`||de-exclude files|`include = ['/Anna']`|
|`filter`|`Boolean`|`true`|searches for `.rsync-filter` files|`filter = true`|
|`dry`|`Boolean`|`false`|rsync flags|`dry = false`|
|`chmod`|`String`||permission of the files in the transfer|`chmod = '+x'`|

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
global.QUIET = false
```


## License

MIT.

[npm-image]: https://img.shields.io/npm/v/rsynconfig.svg?style=flat-square
[npm-url]: https://www.npmjs.com/package/rsynconfig
[travis-image]: https://img.shields.io/travis/lil5/rsynconfig/master.svg?style=flat-square
[travis-url]: https://travis-ci.org/lil5/rsynconfig
[libraries-dep-image]: https://img.shields.io/librariesio/github/lil5/rsynconfig.svg?style=flat-square
[libraries-dep-url]: https://libraries.io/github/lil5/rsynconfig#dependencies
[gh-commits-image]: https://img.shields.io/github/last-commit/lil5/rsynconfig.svg?style=flat-square
[gh-commits-url]: https://github.com/lil5/rsynconfig/commits/master
[gh-license-image]: https://img.shields.io/github/license/lil5/rsynconfig.svg?style=flat-square
[gh-license-url]: https://github.com/lil5/rsynconfig/blob/master/LICENSE
