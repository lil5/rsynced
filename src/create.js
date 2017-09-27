const Rsync = require('rsync')
const path = require('path')

const isString = str => !!(typeof str === 'string' || str instanceof String) && str !== ''

const sshPath = (sshConfig) => {
  if (!(
    isString(sshConfig.host) ||
    isString(sshConfig.user) ||
    isString(sshConfig.path)
  )) {
    throw new Error('ssh config not complete')
  }

  return path.join(
    sshConfig.user + '@' + sshConfig.host + ':' + sshConfig.path
  )
}

/**
 * Create rsync Object using config.
 * @param {Object} config
 * @return {rsync} rsync Object
 * @throw {Error}
 */
module.exports = function create (config) {
  var rsync = new Rsync()
  rsync.cwd(config.cwd)
  rsync.progress()

  ;['flags', 'exclude', 'include'].forEach(el => {
    if (config[el]) rsync[el](config[el])
  })

  if (config.delete === true) {
    rsync.delete()
  }

  if (config.dry === true) {
    rsync.dry()
  }

  if (config.chown) {
    rsync.set('chown', config.chown)
  }

  // define destination and source

  // ssh
  if ((typeof config.ssh === 'object') && (config.ssh !== null)) {
    if (config.ssh.dest) {
      rsync.destination(sshPath(config.ssh.dest))
    }
    if (config.ssh.src) {
      if (config.ssh.dest) {
        throw new Error('the source and destination cannot both be remote')
      }
      rsync.source(sshPath(config.ssh.src))
    }

    if (config.ssh.key) {
      let keyFile = path.resolve(config.cwd, config.sshKey)
      rsync.shell(`ssh -i "${keyFile}"`)
    } else {
      rsync.shell('ssh')
    }
  }

  // log if ssh src and dest
  // console.log(`isString dest: ${isString(rsync.destination())}`)
  // console.log(`isString src[0]: ${isString(rsync.source()[0])}`)

  // log if config src and dist
  // console.log(`dest ${config.dest}`)
  // console.log(`src ${config.src}`)

  // local
  if (!isString(rsync.source()[0])) {
    if (config.src) {
      rsync.source(config.src)
    } else {
      throw new Error('source not set')
    }
  }

  if (!isString(rsync.destination())) {
    if (config.dest) {
      rsync.destination(config.dest)
    } else {
      throw new Error('destination not set')
    }
  }

  return rsync
}
