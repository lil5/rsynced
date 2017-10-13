const ava = require('ava')
const demoFiles = require('./_demo-files')()

const getFile = require('../src/rsync/get-file')

const test = ava.test

test('readFiles with flags prop', t => {
  return getFile(demoFiles.example)
    .catch((err) => {
      t.fail(err)
    })
    .then((data) => {
      t.true(data.hasOwnProperty('flags'))
    })
})

test('readFiles with bad json', t => {
  return getFile(demoFiles.bad)
    .catch((err) => {
      t.regex(err.message,
        // eslint-disable-next-line no-useless-escape
        /^End of input while parsing an object \(missing \'}\'\) at line \d+,\d+ >>>.*.$/
      )
    })
})

test('readFiles missing file', t => {
  return getFile('/bad/file/path.hjson')
    .catch((err) => {
      t.regex(err.message,
        /^ENOENT: no such file or directory, open '\/bad\/file\/path\.hjson'$/
      )
    })
})
