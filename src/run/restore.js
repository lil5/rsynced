const hasSsh = (config, where) => {
  if (config.hasOwnProperty('ssh')) {
    if (config.ssh.hasOwnProperty(where)) {
      return true
    } else return false
  } else return false
}

const restore = (finalConfig) => {
  finalConfig.delete = false
  finalConfig.flags = 'a'

  // object to swap dest and src values with
  const swap = {}

  // set swap values
  if (finalConfig.src && !hasSsh(finalConfig, 'src')) {
    swap.src = finalConfig.src
  }
  if (finalConfig.dest && !hasSsh(finalConfig, 'dest')) {
    swap.dest = finalConfig.dest
  }

  if (finalConfig.ssh) {
    const isSrc = (boolean) => boolean ? 'src' : 'dest'
    ;['src', 'dest'].forEach(el => {
      swap.ssh[isSrc(el)] = finalConfig.ssh[el]
    })
  }

  // get swap values
  if (swap.src) finalConfig.dest = swap.src
  if (swap.dest) finalConfig.src = swap.dest
  if (swap.ssh) finalConfig.ssh = swap.ssh

  return finalConfig
}

module.exports = restore
