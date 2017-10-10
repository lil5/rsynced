const path = require('path')

// rsync
const mergeConfig = require('./merge/merge-config')
const execute = require('./execute')
const create = require('./merge/create')

const run = (config, destination = false, cwd = '.', dry = false) => {
  // resolve paths
  config = path.resolve(cwd, config)

  // merge configiuration files
  return mergeConfig(config, destination)
    .then((finalConfig) => {
      finalConfig.cwd = cwd
      try {
        finalConfig = create(finalConfig)
      } catch (err) {
        return Promise.reject(err)
      }

      if (dry === true) finalConfig.dry()

      return execute(finalConfig)
        .then((rsyncLogs) => rsyncLogs)
    })
}

module.exports = run
