const ava = require('ava')
const demoFiles = require('./_demo-files')(ava)

const mergeConfig = require('../src/rsync/merge/merge-config')

const test = ava.test

// merge
// ----------------
//
test('merge with config supiriority above defaults', t => {
  var defaults = {flags: 'dr', source: '/fee'}
  var config = {
    flags: 'adr',
    destination: '/foo',
  }
  var equal = {
    flags: 'adr',
    source: '/fee',
    destination: '/foo',
  }

  t.deepEqual(
    mergeConfig.merge(defaults, config)
    , equal)
})

// mergeConfig
// ----------------

test('mergeConfig true copy of example', t => {
  var equal = {
    src: 'dir0/',
    dest: 'dir2/',
    flags: 'dra',
    exclude: [
      'node_modules',
      'build',
      'tmp',
      '.rsynconfig.toml',
      '.gitkeep',
    ],
  }
  let result
  try {
    result = mergeConfig(demoFiles.exampleObj())
  } catch (e) {
    t.fail(e)
  }
  t.deepEqual(result, equal)
})

test('mergeConfig with destination copy example', t => {
  var equal = {
    name: 'test',
    src: 'dir0/',
    dest: 'dir1/',
    flags: 'dra',
    delete: true,
    exclude: [
      'node_modules',
      'build',
      'tmp',
      '.rsynconfig.toml',
      '.gitkeep',
    ],
  }

  let result
  try {
    result = mergeConfig(demoFiles.exampleObj(), 'test')
  } catch (e) {
    t.fail(e)
  }
  t.deepEqual(result, equal)
})

test('mergeConfig with bad destination', t => {
  try {
    mergeConfig(demoFiles.exampleObj(), 'baddestination')
  } catch (err) {
    t.true(err.message === '"baddestination" is not in destinations')
  }
})

test('mergeConfig with no destinations', t => {
  var equal = {
    src: 'dir0/',
    dest: 'dir1/',
    flags: 'dra',
  }
  let result
  try {
    result = mergeConfig(demoFiles.simpleObj())
  } catch (e) {
    t.fail(e)
  }
  t.deepEqual(result, equal)
})

test('badConfig with destination', t => {
  try {
    mergeConfig(demoFiles.simpleObj(), 'nodestination')
  } catch (e) {
    t.true(e.message === 'config file does not have a destinations array')
  }
})
