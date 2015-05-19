module.exports = {
  caller: function (key) {
    return function (someObject) {
      return someObject[key]()
    }
  }
}