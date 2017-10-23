const run = require('./run/')
const init = require('./init/')

const dry = (config, destination = false, cwd = '.') => run.sync(config, destination, cwd, true)

module.exports = run.sync
module.exports.async = run.async
module.exports.dry = dry
module.exports.restore = run.restore
module.exports.init = init
