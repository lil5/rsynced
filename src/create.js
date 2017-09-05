const Rsync = require('rsync');
const path = require('path');

/**
 * Create rsync Object using config.
 * @param {Object} config
 * @return {rsync} rsync Object
 * @throw {Error}
 */
module.exports = function create(config) {
  var rsync = new Rsync();
  rsync.cwd(config.cwd);
  rsync.progress();

  if (config.flags) {
    rsync.flags(config.flags);
  }

  if (config.exclude) {
    rsync.exclude(config.exclude);
  }

  if (config.include) {
    rsync.include(config.include);
  }

  if (config.delete) {
    rsync.delete();
  }

  if (config.chown) {
    rsync.set('chown', config.chown);
  }

  // define destination and source

  // ssh
  if (Array.isArray(config.ssh)) {
    let sshPath = (myPath) => {
      return path.join(
        config.ssh.user + '@' + config.ssh.host + ':' + myPath
      );
    };

    if (config.ssh.dest){
      rsync.destination(sshPath(config.dest));
    } else if (config.ssh.source) {
      rsync.destination(sshPath(config.source));
    } else {
      throw new Error('ssh.dest or ssh.source not set');
    }

    if (config.ssh.key) {
      let keyFile = path.resolve(config.cwd, config.sshKey);
      rsync.shell(`ssh -i "${keyFile}"`);
    } else {
      rsync.shell('ssh');
    }
  }

  if (config.source) {
    rsync.source(config.source);
  } else if (rsync.source === '') {
    throw new Error('source not set');
  }

  if (config.dest) {
    rsync.destination(config.dest);
  } else if (rsync.dest === '') {
    throw new Error('dest not set');
  }

  return rsync;
};
