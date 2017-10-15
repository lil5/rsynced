const ava = require('ava')
const fs = require('fs')

const execSync = require('child_process').execSync

const test = ava.test

test('dry without name', t => {
  let result
  try {
    result = execSync(
      'node ../bin/cli.js dry',
      {cwd: './example'}
    )
  } catch (e) {
    t.fail(e.message)
  } finally {
    t.regex(result.toString(), /[\s\S]*sending incremental file list[\s\S]*\^ Log\(s\) end\n[\s\S]*/)
  }
})

test('dry with name', t => {
  let result
  try {
    result = execSync(
      'node ../bin/cli.js dry test',
      {cwd: './example'}
    )
  } catch (e) {
    t.fail(e.message)
  } finally {
    t.regex(result.toString(), /[\s\S]*sending incremental file list[\s\S]*\^ Log\(s\) end[^\n][\s\S]*/)
  }
})

test('dry with glob to name', t => {
  let result
  try {
    result = execSync(
      'node ../bin/cli.js dry te*',
      {cwd: './example'}
    )
  } catch (e) {
    t.fail(e.message)
  } finally {
    t.regex(result.toString(), /[\s\S]*sending incremental file list[\s\S]*\^ Log\(s\) end[^\n][\s\S]*/)
  }
})

test('dry no destination found', t => {
  try {
    execSync(
      'node ../bin/cli.js dry baddestination',
      {cwd: './example'}
    )
  } catch (e) {
    t.regex(e.message, /[\s\S]*Error: No destination found[\s\S]*/)
  }
})

test('init', t => {
  let result
  try {
    result = execSync(
      'node ../bin/cli.js init -f -c init.yaml',
      {cwd: './example'}
    )
  } catch (e) {
    t.fail(e.message)
  } finally {
    t.regex(result.toString(), /[\s\S]*The file has been saved\.[\s\S]*/)
  }
})

test.after('cleanup', () => { fs.unlinkSync('example/init.yaml') })
