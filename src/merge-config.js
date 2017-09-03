const defaultsConfig = require('./defaults');
const NAML = require('naml');
const path = require('path');
const fs = require('fs');

/**
 * read file
 * @param  {string} fp file path with file name
 * @return {Promise}    resolve Object
 */
const readFiles = (fp) => {
  if (fp === false) {
    return Promise.resolve({});
  } else {
    return new Promise((resolve, reject) => {
      fs.readFile(fp, 'utf8', (err, data) => {
        if (err) {
          reject(err);
        }
        try {
          let extention = path.extname(fp);

          resolve(NAML.parse(data, extention));
        } catch (parseErr) {
          reject(parseErr);
        }
      });
    });
  }
};

const merge = function(defaults, config) {
  // merge config with defaults
  Object.getOwnPropertyNames(defaults).forEach(prop => {
    if (! config.hasOwnProperty(prop)) {
      config[prop] = defaults[prop];
    }
  });

  return config;
};

/**
 * read configs from json files and merge into one config object
 * @param  {string} localFp     file path
 * @param  {string}  destination name for the destination setting
 * @return {Promise} result is one config Object
 */
const mergeConfig = (localFp, destination = false) => {
  return readFiles(localFp).then((result) => {

    var localConfig = result;
    var destConfig;
    var finalConfig = defaultsConfig;

    // throw error if there is no match
    // between chosen destination and destinations inside localConfig
    if (destination && destination in localConfig.destinations === false) {
      throw new Error(destination+' is not in destinations');
    }

    // retreve objects from files
    var wasDestination = destination !== false;
    // get localConfigs destinations
    if (localConfig.destinations) {
      if (wasDestination) {
        destConfig = localConfig.destinations[destination];
      }
      delete localConfig.destinations;
    }
    // merge localConfig after localConfigs destinations removed
    finalConfig = merge(finalConfig, localConfig);
    if (wasDestination) {
      finalConfig = merge(finalConfig, destConfig);
    }

    return finalConfig;

  });
};

module.exports = mergeConfig;
module.exports.readFiles = readFiles;
module.exports.merge = merge;
