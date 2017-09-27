const path = require('path')

// rsync
const mergeConfig = require('./merge-config')
const exec = require('./exec')
const create = require('./create')
const initQuestions = require('./init-questions')

const rsynced = (config, destination = false, cwd = '.', dry = false) => {
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

      return exec(finalConfig)
        .then((rsyncLogs) => rsyncLogs)
    })
}

const dry = (config, destination = false, cwd = '.') => rsynced(config, destination, cwd, true)

module.exports = rsynced
module.exports.dry = dry
module.exports.initQuestions = initQuestions
