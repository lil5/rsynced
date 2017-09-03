#!/usr/bin/env node
'use strict';

const program = require('commander');
// const os = require('os');

const rsynced = require('../');

var DEBUG = !! process.env.DEBUG;

// eslint-disable-next-line eqeqeq
const isBoolean = (val) => val == 'true';

// commander argv parser
program
  .version('2.0.0')
  .usage('[options]')
  .option('--cwd [path]', 'set Current Working Directory', process.cwd())
  .option('--config [path], -c', 'set config file', 'rsynced.hjson')
  // .option('--') // dest setting
  .option('--debug [boolian]', 'enable debugging', isBoolean, true)
  .parse(process.argv);

if (program.debug) {
  DEBUG = true;
}

if (!program.config) {
  console.error('No config value set');
  process.exit(1);
}

// rsynced Promise
rsynced(program.config, false, program.cwd)
  .then((result) => {
  // if (program.debug) {
  //   console.log(result);
  // }
    process.exit(result ? 0 : 1);
  })
  .catch(error => {
    if (error) {
      DEBUG
        ? console.error(error.message)
        : console.error(error.stack);
    }

    process.exit(1);
  });
