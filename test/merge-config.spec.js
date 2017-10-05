const ava = require('ava')
const fs = require('fs')

const mergeConfig = require('../src/merge-config')

const test = ava.test
const exampleConfig = 'example/.rsynced.hjson'
const testConfig = 'example/bad.hjson'

// Help Files
// ----------------

ava.before('create bad json', () => fs.writeFileSync('example/bad.hjson',
  `{
  src: dir0/
  destinations: [
    {
      "name": test
      dest: "dir2/"
      delete: true,
    }
  ]
  dest: dir1/
  flags: dra
  exclude: [
    node_modules
    build
    tmp
    local
    .rsynced.hjson
  ]`))

ava.before('create simple json', () => fs.writeFileSync('example/simple.hjson',
  `{
  src: dir0/
  dest: dir1/
  flags: dra
  }`))

ava.after('cleanup', () => {
  fs.unlinkSync('example/simple.hjson')
  fs.unlinkSync('example/bad.hjson')
})

// readFiles
// ----------------

test('readFiles with flags prop', t => {
  return mergeConfig.readFiles(exampleConfig)
    .catch((e) => {
      t.fail(e)
    })
    .then((data) => {
      t.true(data.hasOwnProperty('flags'))
    })
})

test('readFiles with bad json', t => {
  return mergeConfig.readFiles(testConfig)
    .catch((err) => {
      t.regex(err.message,
        // eslint-disable-next-line no-useless-escape
        /^End of input while parsing an object \(missing \'}\'\) at line \d+,\d+ >>>.*.$/
      )
    })
})

test('readFiles missing file', t => {
  return mergeConfig.readFiles('/bad/file/path.hjson')
    .catch((err) => {
      t.regex(err.message,
        /^ENOENT: no such file or directory, open '\/bad\/file\/path\.hjson'$/
      )
    })
})

// merge
// ----------------

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
      'local',
      '.rsynced.hjson',
    ],
  }

  return mergeConfig(exampleConfig)
    .catch((err) => {
      t.fail(err)
    })
    .then((data) => {
      t.deepEqual(data, equal)
    })
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
      'local',
      '.rsynced.hjson',
    ],
  }

  return mergeConfig(exampleConfig, 'test')
    .catch((err) => {
      t.fail(err)
    })
    .then((data) => {
      t.deepEqual(data, equal)
    })
})

test('mergeConfig with bad destination', t => {
  return mergeConfig(exampleConfig, 'baddestination')
    .catch((err) => {
      t.deepEqual(err.message, '"baddestination" is not in destinations')
    })
})

test('mergeConfig with no destinations', t => {
  var equal = {
    src: 'dir0/',
    dest: 'dir1/',
    flags: 'dra',
  }
  return mergeConfig('example/simple.hjson')
    .catch((err) => {
      t.fail(err)
    })
    .then((data) => {
      t.deepEqual(data, equal)
    })
})
