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
    var currElem
    var returnArr = []
    var cssString = jcssString.match(this.cssRegex)
    if(!cssString) return [['js', jcssString], ['css', '']]
    if(cssString == jcssString) return [['css', jcssString], ['js', '']]
    var jcssSplit = jcssString.split(cssString[0]).reverse()
    while((currElem = jcssSplit.pop()) != undefined) {
      currElem.length > 0 ? returnArr.push(['js', currElem]) : returnArr.push(['css', cssString[0]])
    }
    return returnArr
  },

  interpret: function (someArr) {
    return (someArr[0] == 'js' ? this.exec(someArr[1]) : someArr[1])
  },

  parse: function (jcssString) {
    var splitJcss = []
    var parsedCss = ''
    while(splitJcss = this.split(jcssString)) {
      parsedCss += this.interpret(splitJcss[0]) + this.interpret(splitJcss[1])
      jcssString = jcssString.substr(0, splitJcss[0][1].length + splitJcss[0][1].length)
    }
    return parsedCSS
  }
}
