const findAllAmount = (config, name) => {
  let names = []

  if (config.destinations) {
    ;(config.destinations).forEach(el => {
      // eslint-disable-next-line no-useless-escape
      let isFound = (el.name).search(new RegExp(`^${name}(-[0-9]+)?$`)) !== -1

      if (isFound) names.push(el.name)
    })
    if (names === []) throw new Error('"' + name + '" is not in destinations')
  } else {
    return [false]
  }

  return names
}

module.exports = findAllAmount
