const path = require('path')
const fs = require('fs')
const questions = require('questions')
const NAML = require('naml')

const fileTemplate = (options) => `{
  destinations: [
    {
      name: 'default',
      src: '',
      ${options.isSSH ? `// dest: '',
      ssh: { dest: {
        host: 'localhost',
        user: 'lil',
        path: '/media/lil/RedCard/Projects/rsynced/example/dir1/',
        key: './my.key',
      }},` : `dest: '',`}
      // delete: false,
      flags: 'u',
      exclude: [
      ],
      include: [
      ],
    },
  ],
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
