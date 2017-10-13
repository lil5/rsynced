const ava = require('ava')

const findElement = require('../src/rsync/merge/find-element')

const test = ava.test

const demoArr = [
  {name: 'first'},
  {name: 'second'},
  {name: 'third'},
  {name: 'forth'},
]

test('get first index', t => {
  t.true(
    findElement(demoArr, 'name', 'first') === 0)
})

test('get third index', t => {
  t.true(
    findElement(demoArr, 'name', 'third') === 2
  )
})

test('get nothing with bad value', t => {
  t.false(findElement(demoArr, 'name', 'none'))
})

test('get nothing with bad name', t => {
  t.false(findElement(demoArr, 'none', 'second'))
})
