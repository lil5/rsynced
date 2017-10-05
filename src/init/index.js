const path = require('path')
const fs = require('fs')
const questions = require('questions')
const NAML = require('naml')

const templates = require('./templates')

const init = (isForce, filename, cwd = '.') => {
  const thisFile = path.resolve(cwd, filename)
  const thisFileExt = path.extname(thisFile)
  // let isFile = true

  return new Promise((resolve, reject) => {
    questions.askOne({info: 'Using SSH? [y/n]', default: 'y'}, result => {
      let isSSH = result.search(/^y(es)?$/i) === 0

      let fileContents = ''

      switch (thisFileExt) {
        case '.toml':
          fileContents = templates.toml({isSSH: isSSH})
          break
        case '.hjson':
        case '.json5':
          fileContents = templates.json({isSSH: isSSH})
          break
        default:
          fileContents = templates.json({isSSH: isSSH})
          try {
            fileContents = NAML.stringify(
              NAML.parse(fileContents, 'json5'),
              thisFileExt)
          } catch (err) {
            reject(err)
          }
      }
      resolve(fileContents)
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

module.exports = init
