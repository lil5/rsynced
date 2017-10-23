const ava = require('ava')
const demoFiles = require('./_demo-files')(ava)

const mergeConfig = require('../src/rsync/merge/merge-config')
const restore = require('../src/run/restore')

const test = ava.test

test('restore true copy of example', t => {
  var equal = {
    src: 'dir2/',
    dest: 'dir0/',
    delete: false,
    flags: 'a',
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
    result = restore(result)
  } catch (e) {
    t.fail(e)
  }

  t.deepEqual(result, equal)
})
