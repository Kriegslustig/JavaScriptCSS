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
  },

  cssRegex: /^[\s\t]*([^\n\(\)]+\,\n)*([^\n\(\)]+)?\{[^\}]*\}\n?/gm,

  split: function (jcssString) {
    var self = this
    var currElem
    var returnArr = []
    var cssString = jcssString.match(self.cssRegex)[0]
    var jcssSplit = jcssString.split(cssString).reverse()
    while((currElem = jcssSplit.pop()) != undefined) {
      currElem.length > 0 ? returnArr.push(['js', currElem]) : returnArr.push(['css', cssString])
    }
    return returnArr
  }
}
