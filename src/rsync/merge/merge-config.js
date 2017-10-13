const defaultsConfig = require('../../defaults')
const findElement = require('./find-element')

/**
 * merge two objects tegether
 * @param  {object} defaults inferior object
 * @param  {object} config   superior object
 * @return {object}          merged object
 */
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
 * Merge into one config object
 * @param  {object} localConfig     local config object
 * @param  {string} name            name for the destination setting
 * @return {object}                 one config object
 */
const mergeConfig = (localConfig, name = false) => {
  console.log('localConfig:', localConfig)
  var destConfig
  var finalConfig = defaultsConfig

  // retreve objects from files
  var isDestinations = name !== false

  // throw error if there is no match
  // between chosen destination and destinations inside localConfig
  var whichDestination = false
  if (isDestinations) {
    // check if config has destinations too
    if (!(
      localConfig.hasOwnProperty('destinations') &&
      Array.isArray(localConfig.destinations)
    )) {
      throw new Error(`config file does not have a destinations array`)
    }

    whichDestination =
      findElement(localConfig.destinations, 'name', name)
    if (whichDestination === false) {
      throw new Error(`"${name}" is not in destinations`)
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
}

module.exports = mergeConfig
module.exports.merge = merge
