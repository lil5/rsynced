# Rsynced

Upload project to one or multiple locations at one time.

## Installation

Global Install

npm:

```shell
npm i -global https://github.com/lil5/rsynced
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
  ssh: {
    source: {
      host: 127.0.0.1
      user: root
      source: build/*
      sshKey: local/key
    }
  }
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

* **name** Host name
* **sshKey** Path to your private key.
* **root** Host root.
* **dest** Destination relative to the root.

**NOTE**. Exclude `rsync.hjson` from the sync command on your own.

Run synchronization:
```
rsynced
```

**NOTE**. Run `rsynced -h` for more information about CLI arguments

### Nodejs Module

```javascript
const rsynced = require('rsynced')

rsynced(program.config, false, program.cwd)
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
