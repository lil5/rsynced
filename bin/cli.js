#!/usr/bin/env node
'use strict'

const program = require('commander')
const chalk = require('chalk')
const rsynconfig = require('../')

// set global logging varaibles
global.QUIET = false
global.DEBUG = false

// for debug logs
// if (!global.QUIET && global.DEBUG)
//
// for basic logs
// if (!global.QUIET)

const setVerbosity = (verbose, quiet) => {
  if (process.env === 'development' || verbose) global.DEBUG = true
  if (quiet) global.QUIET = true
}

// commands for rsynconfig
const rsynconfigThen = resultArr => {
  let isDefault = resultArr.names[0] === false
  if (!global.QUIET) console.info(chalk.bold(`^ Log(s) end${isDefault ? '' : ` of ${resultArr.names.join(', ')}`}`))
  let isOnceCanceled = false
  ;(resultArr.logs).forEach((result, i) => {
    let name = resultArr.names[i]
    if (result === false) {
      if (!global.QUIET) console.error(chalk.red.bold(`Canceled${isDefault ? '' : ` ${name}`}`))
      isOnceCanceled = true
    } else {
      if (!global.QUIET) console.info(chalk.bold(`Command${isDefault ? '' : ` ${name}`}`))
      if (!global.QUIET) console.log(result.cmd)
    }
  })
  process.exit(isOnceCanceled ? 1 : 0)
}
const rsynconfigCatch = error => {
  if (error) {
    if (!global.QUIET) console.error(chalk.red.bold('Error:'), error.message)
    if (!global.QUIET && global.DEBUG) console.error(chalk.grey(error.stack))
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
  .action((name = false, options) => {
    setVerbosity(options.verbose, options.quiet)

    // rsynconfig Promise
    rsynconfig(options.config, name, '.')
      .then((result) => rsynconfigThen(result))
      .catch(error => rsynconfigCatch(error))
  })

program
  .command('async [name]')
  .option('-q --quiet', 'disable output')
  .option('-v --verbose', 'enable verbose output')
  .option('-c, --config [filename]', 'set config file', '.rsynconfig.toml')
  .action((name = false, options) => {
    setVerbosity(options.verbose, options.quiet)

    // rsynconfig Promise
    rsynconfig.async(options.config, name, '.')
      .then((result) => rsynconfigThen(result))
      .catch(error => rsynconfigCatch(error))
  })

program
  .command('dry [name]')
  .option('-q --quiet', 'disable output')
  .option('-v --verbose', 'enable verbose output')
  .option('-c, --config [filename]', 'set config file', '.rsynconfig.toml')
  .action((name = false, options) => {
    setVerbosity(options.verbose, options.quiet) // always verbose unless quiet

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
      .then((result) => {
        if (!global.QUIET) console.log(result)
      })
      .catch(error => rsynconfigCatch(error))
  })

program.parse(process.argv)
