#!/usr/bin/env node
'use strict'

const program = require('commander')
const log = require('loglevel')
const consoleSize = require('window-size')
const rsynconfig = require('../')

const setVerbosity = (verbose, quiet) => {
  /* eslint-disable eqeqeq */
  if (process.env === 'development') log.setLevel('trace')
  else if (quiet) log.setLevel(log.levels.SILENT)
  else if (verbose) log.setLevel('debug')
  else log.setLevel('info')
  /* eslint-enable */
}

const drawLine = (text = '') => {
  text = text.toUpperCase()
  let size = consoleSize.get().width
  let line = `---${text.length > 0 ? ` ${text} ` : ''}-`
  while (size > line.length) {
    line += '-'
  }
  line = '\n' + line
  return line
}

// commands for rsynconfig
const rsynconfigThen = resultArr => {
  (resultArr.logs).forEach((result, i) => {
    let name = resultArr.names[i]
    if (result === false) {
      log.error(drawLine(`canceled: ${name}`))
    } else {
      log.info(drawLine(`^ log ${name} end`) + '\n')
      log.info(drawLine(`command ${name}`))
      log.info(result.cmd)
    }
    process.exit(result ? 0 : 1)
  })
}
const rsynconfigCatch = error => {
  if (error) {
    log.error(drawLine('error') + '\n' + error.message)
    log.trace(error.stack)
  }

  process.exit(1)
}

// commander argv parser
program
  .version('2.0.1')

program
  .command('run [name]')
  .option('-q --quiet', 'disable output')
  .option('-v --verbose', 'enable verbose output')
  .option('-c, --config [filename]', 'set config file', '.rsynconfig.toml')
  .action((name, options) => {
    setVerbosity(options.verbose, options.quiet)
    // log.trace(options)

    // rsynconfig Promise
    rsynconfig(options.config, name, '.')
      .then((result) => rsynconfigThen(result))
      .catch(error => rsynconfigCatch(error))
  })

program
  .command('dry [name]')
  .option('-q --quiet', 'disable output')
  .option('-c, --config [filename]', 'set config file', '.rsynconfig.toml')
  .action((name, options) => {
    setVerbosity(true, options.quiet) // always verbose unless quiet

    // rsynconfig Promise
    rsynconfig.dry(options.config, name, '.')
      .then((result) => rsynconfigThen(result))
      .catch(error => rsynconfigCatch(error))
  })

program
  .command('init')
  .option('-f --force')
  .option('-c, --config [filename]', 'set config file', '.rsynconfig.toml')
  .action((options) => {
    setVerbosity(false, false) // info to warning

    rsynconfig.init(
      options.force,
      options.config,
      '.'
    )
      .then((result) => log.info(result))
      .catch(error => rsynconfigCatch(error))
  })

program.parse(process.argv)
