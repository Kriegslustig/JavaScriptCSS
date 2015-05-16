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
    var cssString = jcssString.match(self.cssRegex)
    if(!cssString) return [['js', jcssString], ['css', '']]
    if(cssString == jcssString) return [['css', jcssString], ['js', '']]
    var jcssSplit = jcssString.split(cssString[0]).reverse()
    while((currElem = jcssSplit.pop()) != undefined) {
      currElem.length > 0 ? returnArr.push(['js', currElem]) : returnArr.push(['css', cssString[0]])
    }
    return returnArr
  },

  parse: function () {}
}
