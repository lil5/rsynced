const mergeConfig = require('./merge-config');
const exec = require('./exec');
const create = require('./create');


const rsynced = (config, destination = false, cwd = process.cwd()) => {

  // merge configiuration files
  return mergeConfig(config)
    .then((finalConfig) => {
      finalConfig.cwd = cwd;
      try {
        finalConfig = create(finalConfig);
      } catch (err) {
        return Promise.reject(err);
      }

      return exec(finalConfig)
        .then((rsyncLogs) => rsyncLogs);
    });
};

module.exports = rsynced;
module.exports.create = create;
module.exports.exec = exec;
// sync.defaults = defaults;
