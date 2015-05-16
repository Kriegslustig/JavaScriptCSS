module.exports = {
  exec: function (javaScriptString) {
    var returnString = ''
    function css (cssString) {
      returnString += cssString
    }
    try {
      eval(javaScriptString)
    } catch (e) {
      return false
    }
    return returnString
  }
}
