const path = require('path')
const fs = require('fs')
const questions = require('questions')
const NAML = require('naml')

const fileTemplate = (options) => `{
\tdestinations: [
\t\t{
\t\t\tname: 'default',
\t\t\tsrc: '',
\t\t\t${options.isSSH ? `// dest: '',
\t\t\tssh: { dest: {
\t\t\t\thost: 'localhost',
\t\t\t\tuser: 'lil',
\t\t\t\tpath: '/media/lil/RedCard/Projects/rsynced/example/dir1/',
\t\t\t\tkey: './my.key',
\t\t\t}},` : `dest: '',`}
\t\t\t// delete: false,
\t\t\tflags: 'u',
\t\t\texclude: [
\t\t\t],
\t\t\tinclude: [
\t\t\t],
\t\t},
\t],
}`

const initQuestions = (isForce, filename, cwd = '.') => {
  const thisFile = path.resolve(cwd, filename)
  const thisFileExt = path.extname(thisFile)
  // let isFile = true

  return new Promise((resolve, reject) => {
    questions.askOne({info: 'Using SSH? [y/n]', default: 'y'}, result => {
      let isSSH = result.search(/^y(es)?$/i) === 0

      var thisFileTemplate = fileTemplate({isSSH: isSSH})

      if (!(thisFileExt === '.hjson' || thisFileExt === '.json5')) {
        try {
          thisFileTemplate = NAML.stringify(
            NAML.parse(thisFileTemplate, 'json5'),
            thisFileExt)
        } catch (err) {
          reject(err)
        }
      }
      resolve(thisFileTemplate)
    })
  }).then(result => {
    // write file
    return new Promise((resolve, reject) => {
      fs.writeFile(thisFile, result, {flag: isForce ? 'w' : 'wx'}, (err) => {
        if (err) reject(err)

        resolve('The file has been saved.')
      })
    })
  })
}

module.exports = initQuestions
