const ava = require('ava')
const fs = require('fs')
const NAML = require('naml')

module.exports = () => {
  const bad = `{
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
    .rsynconfig.toml
  ]`
  ava.before('create bad hjson', () => fs.writeFileSync('example/bad.hjson', bad))

  const simple = `src: dir0/
dest: dir1/
flags: dra
`
  ava.before('create simple yaml', () => fs.writeFileSync('example/simple.yaml', simple))

  const example = `# **NOTE** tests will break if edited!
src = "dir0/"
dest = "dir2/"
flags = "dra"
exclude = ["node_modules", "build", "tmp", ".rsynconfig.toml", ".gitkeep"]

[[destinations]]
name = "test"
dest = "dir1/"
delete = true
`
  ava.before('create example toml', () => fs.writeFileSync('example/.rsynconfig.toml', example))

  ava.after('cleanup', () => {
    fs.unlinkSync('example/simple.yaml')
    fs.unlinkSync('example/bad.hjson')
  })

  return {
    example: 'example/.rsynconfig.toml',
    exampleObj: () => NAML.parse(example, 'toml'),
    bad: 'example/bad.hjson',
    simple: 'example/simple.yaml',
    simpleObj: () => NAML.parse(simple, 'yaml'),
  }
}

ava.before('global QUIET', () => { global.QUIET = true })
