const promiseAllSync = (promise, options) => new Promise((resolve, reject) => {
  let index = 0
  let resultAll = []

  function loop (result = undefined) {
    if (result !== undefined) {
      // run execpt first time
      resultAll.push(result)
    }

    if (options.length > index) {
      return promise.apply(this, options[index])
        .catch(err => reject(err))
        .then(result => {
          ++index
          loop(result)
        })
    } else return resolve(resultAll)
  }
  loop()
})

module.exports = promiseAllSync
