const defaultsConfig = require('../../defaults')
const findElement = require('./find-element')
const NAML = require('naml')
const path = require('path')
const fs = require('fs')

/**
 * read file
 * @param  {string} fp file path with file name
 * @return {Promise}    resolve Object
 */
const readFiles = (fp) => {
  // if (fp === false) { // use if user defaults feature completed
  //   return Promise.resolve({});
  // } else {
  return new Promise((resolve, reject) => {
    fs.readFile(fp, 'utf8', (err, data) => {
      if (err) {
        reject(err)
      }
      let ans = {}
      try {
        let extention = path.extname(fp)

        ans = NAML.parse(data, extention)
      } catch (parseErr) {
        reject(parseErr)
      }

      resolve(ans)
    })
  })
  // }
}

const merge = (defaults, config) => {
  // merge config with defaults
  Object.getOwnPropertyNames(defaults).forEach(prop => {
    if (!config.hasOwnProperty(prop)) {
      config[prop] = defaults[prop]
    }
  })

  return config
}

/**
 * read configs from json files and merge into one config object
 * @param  {string} localFp     file path
 * @param  {string}  destination name for the destination setting
 * @return {Promise} result is one config Object
 */
const mergeConfig = (localFp, destination = false) => {
  return readFiles(localFp).then((result) => {
    var localConfig = result
    var destConfig
    var finalConfig = defaultsConfig

    // retreve objects from files
    var isDestinations = destination !== false

    // throw error if there is no match
    // between chosen destination and destinations inside localConfig
    var whichDestination = false
    if (isDestinations) {
      whichDestination =
      findElement(localConfig.destinations, 'name', destination)

      if (whichDestination === false) {
        throw new Error('"' + destination + '" is not in destinations')
      }
    }

    // get localConfigs destinations
    if (localConfig.destinations) {
      if (isDestinations) {
        destConfig = localConfig.destinations[whichDestination]
      }
      delete localConfig.destinations
    }
    // merge localConfig after localConfigs destinations removed
    finalConfig = merge(finalConfig, localConfig)
    if (isDestinations) {
      finalConfig = merge(finalConfig, destConfig)
    }

    return finalConfig
  })
}

module.exports = mergeConfig
module.exports.readFiles = readFiles
module.exports.merge = merge
