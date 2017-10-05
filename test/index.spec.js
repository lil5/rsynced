const ava = require('ava')
const fs = require('fs')
const rsynced = require('../')

const test = ava.test

ava.after('remove files', () => fs.unlinkSync('example/dir1/newfile.txt'))

test('full rsync using destinations', t => {
  return rsynced('.rsynced.hjson', 'test', './example')
    .then((result) => {
      t.true(fs.existsSync('example/dir1/newfile.txt'))
      // process.exit(result ? 0 : 1)
    })
    .catch(error => {
      console.error(error.message)
    })
})
