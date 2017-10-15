const path = require('path')

const findAllAmount = require('./find-all-amount')
const promiseAllSync = require('./promise-all-sync')
const execSync = require('child_process').execSync

// rsync
/* 1 */ const getFile = require('../rsync/get-file')
/* 2 */ const mergeConfig = require('../rsync/merge/merge-config')
/* 3 */ const createRsyncObj = require('../rsync/merge/create-rsync-obj')
/* 4 */ const execute = require('../rsync/execute')

const _run = (isAsync, configFilePath, destination = false, cwd = '.', dry = false) => {
  // resolve paths
  configFilePath = path.resolve(cwd, configFilePath)

  // merge configiuration files
  return getFile(configFilePath)
    .then(config => {
      let destinations = findAllAmount(config, destination)
      if (destinations < 1) {
        return Promise.reject(new Error('No destination found'))
      }

      // before and after script in array
      let beforeArr = []
      let afterArr = []

      let configs = []
      try { // merge configs with defaults
        destinations.forEach((dest, i) => {
          // copy Object values under seperate data referances
          let newConfig = Object.assign({}, config)

          let finalConfig = mergeConfig(newConfig, dest)
          finalConfig.cwd = cwd
          finalConfig.dry = dry
          if (finalConfig.after) afterArr.push(finalConfig.after)
          if (finalConfig.before) beforeArr.push(finalConfig.before)
          configs.push([createRsyncObj(finalConfig)])
        })
      } catch (err) {
        return Promise.reject(err)
      }

      // run before scripts
      if (dry !== true) {
        beforeArr.forEach(command => {
          execSync(command, {cwd: cwd})
        })
      }

      const thisReturn = logs => {
        // run after scripts
        if (dry !== true) {
          afterArr.forEach(command => {
            execSync(command, {cwd: cwd})
          })
        }

        destinations = destinations === false ? ['default'] : destinations
        return {
          names: destinations,
          logs: logs,
        }
      }

      if (isAsync) {
        let rsyncs = [] // Array<Promise>
        destinations.forEach((dest, i) => {
          rsyncs.push(execute(configs[i][0]))
        })

        return Promise.all(rsyncs).then(logs => thisReturn(logs))
      } else {
        return promiseAllSync(execute, configs).then(logs => thisReturn(logs))
      }
    })
}

module.exports.sync =
  (configFilePath, destination = false, cwd = '.', dry = false) => _run(false, configFilePath, destination, cwd, dry)
module.exports.async =
  (configFilePath, destination = false, cwd = '.', dry = false) => _run(true, configFilePath, destination, cwd, dry)
