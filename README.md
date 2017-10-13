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
  // ..
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

## License

MIT.
