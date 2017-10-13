const run = require('./run/')
const init = require('./init/')

const dry = (config, destination = false, cwd = '.') => run(config, destination, cwd, true)

module.exports = run
module.exports.dry = dry
module.exports.init = init
