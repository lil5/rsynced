const Rsync = require('rsync');
const path = require('path');

const defaults = require('./defaults');

module.exports = sync;

function create(dir, config) {
    Object.getOwnPropertyNames(defaults).forEach(prop => {
        if (! config.hasOwnProperty(prop)) {
            config[prop] = defaults[prop];
        }
    });

    var rsync = new Rsync();
    var keyFile = config.sshKey
        ? path.resolve(process.cwd(), config.sshKey)
        : path.join(process.env.HOME, '.ssh', 'id_rsa');

    rsync
    .shell(`ssh -i "${keyFile}"`)
    .dirs()
    .flags()
    .recursive();

    if (config.relative) {
        rsync.set('relative', config.relative);
    }

    if (config.source) {
        rsync.source(config.source);
    }

    if (config.exclude) {
        rsync.exclude(config.exclude);
    }

    if (config.include) {
        rsync.include(config.include);
    }

    if (config.chown) {
        rsync.set('a').set('chown', config.chown);
    }

    rsync.destination(
        path.join(
            config.user + '@' + config.host + ':' + (config.root || ''),
            config.dest
        )
    );

    return rsync;
}

function sync(options = {}) {
    return exec(create(options.dir, options.config));
}

function exec(rsync) {
    return new Promise((resolve, reject) => {
        var child;

        function onQuit() {
            if (child) {
                child.kill();
            }

            reject(new Error('Unexpectedly exited'));
            unbind();
        };

        function onStop() {
            resolve(false);
            unbind();
        }

        function bind() {
            process.on('SIGINT', onStop);
            process.on('SIGTERM', onStop);
            process.on('exit', onQuit);
        }

        function unbind() {
            process.removeListener('SIGINT', onStop);
            process.removeListener('SIGTERM', onStop);
            process.removeListener('exit', onQuit);
        }

        child = rsync.execute(function(error){
            if (error) {
                reject(error);
            } else {
                resolve(true);
            }

            unbind();
        });

        bind();
    });
}

sync.create = create;
sync.defaults = defaults;
