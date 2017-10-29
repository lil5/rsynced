const path = require('path')

const findAllAmount = require('./find-all-amount')
const restore = require('./restore')
const promiseAllSync = require('./promise-all-sync')
const execSync = require('child_process').execSync

// rsync
/* 1 */ const getFile = require('../rsync/get-file')
/* 2 */ const mergeConfig = require('../rsync/merge/merge-config')
/* 3 */ const createRsyncObj = require('../rsync/merge/create-rsync-obj')
/* 4 */ const execute = require('../rsync/execute')

const _run = (
  configFilePath,
  destination = false,
  cwd = '.',
  isAsync = false,
  isDry = false,
  isRestore = false,
  isCommand = false,
) => {
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
          finalConfig.dry = isDry
          if (isRestore) finalConfig = restore(finalConfig)
          if (finalConfig.after) afterArr.push(finalConfig.after)
          if (finalConfig.before) beforeArr.push(finalConfig.before)
          configs.push([createRsyncObj(finalConfig)])
        })
      } catch (err) {
        return Promise.reject(err)
      }
      if (isCommand !== true) {
      // run before scripts
        if (isDry !== true && isRestore !== true) {
          beforeArr.forEach(command => {
            execSync(command, {cwd: cwd})
          })
        }

        const thisReturn = logs => {
        // run after scripts
          if (isDry !== true && isRestore !== true) {
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
      } else { // isCommand: true
        let commands = []
        ;(configs).forEach(thisRsync => {
          commands.push(thisRsync[0].command())
        })
        return {
          commands: commands,
          before: beforeArr,
          after: afterArr,
        }
      }
    })
}

module.exports.sync =
  (configFilePath, destination = false, cwd = '.', isDry = false) => _run(
    configFilePath,
    destination,
    cwd,
    false,
    isDry,
    false,
    false,
  )

module.exports.async =
  (configFilePath, destination = false, cwd = '.', isDry = false) => _run(
    configFilePath,
    destination,
    cwd,
    true,
    isDry,
    false,
    false,
  )

module.exports.restore =
  (configFilePath, destination = false, cwd = '.', isDry = false) => _run(
    configFilePath,
    destination,
    cwd,
    false,
    isDry,
    true,
    false,
  )

module.exports.command =
  (configFilePath, destination = false, cwd = '.', isRestore = false) => _run(
    configFilePath,
    destination,
    cwd,
    false,
    false,
    isRestore,
    true,
  )
