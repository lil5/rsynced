const ava = require('ava')

const findAllAmount = require('../src/run/find-all-amount')

const test = ava.test

const demoArr = [
  {name: 'first'},
  {name: 'second'},
  {name: 'third-0'},
  {name: 'third-1'},
  {name: 'third-3'},
  {name: 'forth'},
]

test('get ome destination', t => {
  let ans = findAllAmount(
    {destinations: [demoArr[0]]},
    'first',
  )
  t.deepEqual(ans, ['first'])
})

test('get one destination', t => {
  let ans = findAllAmount(
    {destinations: demoArr},
    'third-0',
  )
  t.deepEqual(ans, ['third-0'])
})

test('get multipule destinations', t => {
  let ans = findAllAmount(
    {destinations: demoArr},
    'third',
  )
  t.deepEqual(ans, ['third-0', 'third-1', 'third-3'])
})

test('give no destinations', t => {
  let ans = findAllAmount(
    {},
    'third',
  )
  t.deepEqual(ans, [false])
})
