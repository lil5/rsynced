#!/usr/bin/env node
'use strict'

const program = require('commander')
const log = require('loglevel')
const rsynced = require('../')

const setVerbosity = (verbose, quiet) => {
  /* eslint-disable eqeqeq */
  if (process.env === 'development') log.setLevel('trace')
  else if (quiet) log.setLevel(log.levels.SILENT)
  else if (verbose) log.setLevel('debug')
  else log.setLevel('info')
  /* eslint-enable */
}

// commands for rsynced
const rsyncedThen = result => {
  log.info(result.cmd)
  log.info(result.stdout)
  process.exit(result ? 0 : 1)
}
const rsyncedCatch = error => {
  if (error) {
    log.error(error.message)
    log.trace(error.stack)
  }

  process.exit(1)
}

// commander argv parser
program
  .version('2.0.1')

program
  .command('run')
  .option('-q --quiet', 'disable output')
  .option('-v --verbose', 'enable verbose output')
  .option('-n, --name <string>', 'set name of destination', /^[a-zA-Z]+(-[0-9]+)?$/)
  .option('-c, --config [filename]', 'set config file', 'rsynced.hjson')
  .option('--cwd [path]', 'set Current Working Directory', '.')
  .action((options) => {
    setVerbosity(options.verbose, options.quiet)
    // log.trace(options)

    // rsynced Promise
    rsynced(options.config, options.name, options.cwd)
      .then((result) => rsyncedThen(result))
      .catch(error => rsyncedCatch(error))
  })

program
  .command('dry')
  .option('-q --quiet', 'disable output')
  .option('-n, --name <string>', 'set name of destination', /^[a-zA-Z]+(-[0-9]+)?$/)
  .option('-c, --config [filename]', 'set config file', 'rsynced.hjson')
  .option('--cwd [path]', 'set Current Working Directory', '.')
  .action((options) => {
    setVerbosity(true, options.quiet) // always verbose unless quiet

    // rsynced Promise
    rsynced.dry(options.config, options.name, options.cwd)
      .then((result) => rsyncedThen(result))
      .catch(error => rsyncedCatch(error))
  })

program
  .command('init')
  .option('-f --force')
  .option('-c, --config [filename]', 'set config file', 'rsynced.hjson')
  .option('--cwd [path]', 'set Current Working Directory', '.')
  .action((options) => {
    setVerbosity(false, false) // info to warning

    rsynced.initQuestions(
      options.force,
      options.config,
      options.cwd,
    )
      .then((result) => log.info(result))
      .catch(error => rsyncedCatch(error))
  })

program.parse(process.argv)
