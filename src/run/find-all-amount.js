const minimatch = require('minimatch')

const findAllAmount = (config, name) => {
  let names = []

  if (config.destinations && name !== false) {
    ;(config.destinations).forEach(el => {
      // eslint-disable-next-line no-useless-escape
      let isFound = minimatch(el.name, name)

      if (isFound) names.push(el.name)
    })
    if (names === []) throw new Error('"' + name + '" is not in destinations')
  } else {
    return [false]
  }

  return names
}

module.exports = findAllAmount
