/**
 * find destination using its name
 * @param  {Array} arr         destinations
 * @param  {string} propName   property name
 * @param  {string} propValue  property value
 * @return {int}               destination index
 * @return          false      false if none found
 */
const findElement = (arr, propName, propValue) => {
  for (var i = 0; i < arr.length; i++) {
    if (arr[i][propName] === propValue) {
      return i
    }
  }
  return false
}

module.exports = findElement
