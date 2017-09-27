# Rsynced

Upload project to one or multiple locations at one time.

## Installation

Global Install

npm:

```shell
npm i -g https://github.com/lil5/rsynced
```

yarn:

```shell
yarn global add https://github.com/lil5/rsynced
```

For local installation remove `global` option to command

## Usage

### CLI

Create `rsync.hjson` file into root of the project:

```hjson
{
  destinations: [
    {
      name: home
      ssh: {
        src: {
          host: 127.0.0.1
          user: root
          path: build/*
          sshKey: local/key
        }
      }
    }
  ]
  src: build/
  dest: /root/projects/project
  exclude: [
    node_modules,
    build,
    tmp,
    local,
    rsync.json,
  ]
}
```

**NOTE**. Exclude `rsync.hjson` from the sync command on your own.

Run synchronization:
```
rsynced
```

**NOTE**. Run `rsynced -h` for more information about CLI arguments

### Nodejs Module

```javascript
const rsynced = require('rsynced')

rsynced(configFile, destinationsName, cwd)
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
