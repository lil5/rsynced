const NAML = require('naml')
const path = require('path')
const fs = require('fs')

/**
 * read file
 * @param  {string} fp file path with file name
 * @return {Promise}    resolve Object
 */
const getFile = (fp) => {
  // if (fp === false) { // use if user defaults feature completed
  //   return Promise.resolve({});
  // } else {
  return new Promise((resolve, reject) => {
    fs.readFile(fp, 'utf8', (err, data) => {
      if (err) {
        reject(err)
      }
      let ans = {}
      try {
        let extention = path.extname(fp)

        ans = NAML.parse(data, extention)
      } catch (parseErr) {
        reject(parseErr)
      }

      resolve(ans)
    })
  })
  // }
}

module.exports = getFile
