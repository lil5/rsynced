# Rsynced

Upload project to one or multiple locations at one time.

## Installation

Install via npm:

```shell
npm i rsynced
```

## Usage

Create `rsync.json` file into root of the project:

```json
{
  "destinations": [
    {
      "name": "stage",
      "host": "127.0.0.1",
      "user": "root",
      "chown": ":www-data",
      "dest": "/root/projects/project",
      "source": "build/*",
      "sshKey": "local/key"
    }
  ],
  "exclude": [
    "node_modules",
    "build",
    "tmp",
    "local",
    "rsync.json"
  ]
}
```

* **name** Host name
* **sshKey** Path to your private key.
* **root** Host root.
* **dest** Destination relative to the root.

**NOTE**. Exclude `rsync.json` from the sync command on your own.

Install `rsynced` package. Add npm `sync` command into your `package.json`:

```json
{
    "scripts": {
        "sync": "rsynced"
    }
}
```

Run synchronization:
```
npm run sync -- stage
```

## License

MIT.
