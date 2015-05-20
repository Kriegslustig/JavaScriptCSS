module.exports = {
  caller: function (key) {
    return function (someObject) {
      return key ? someObject[key]() : someObject()
    }
  }
}