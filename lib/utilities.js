module.exports = {
  caller: function (key) {
    return function (someObject) {
      return key ? someObject[key]() : someObject()
    }
  },
  runArray: function (funcArr) {
    return funcArr.map(function (func) { return func() })
  },
  stringFormat: function (someString, replacement, replaceThis) {
    replacement.forEach(function (value) { someString = someString.replace(replaceThis, value) })
    return someString
  }
}