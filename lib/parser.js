module.exports = {
  exec: function (javaScriptString) {
    var returnString = ''
    function css (cssString) {
      returnString += cssString
    }
    try {
      eval(javaScriptString)
    } catch (e) {
      console.log('Exception in your jcss')
      console.log(javaScriptString)
      console.log(e)
      return false
    }
    return returnString
  },

  split: function (jcssString) {
    /*
      ^[
          \s\t
        ]*
        (
          (
            (
              (
                [\.\#]?
                [\w\-_\d]+
              )
              |
              \*
            )
            |
            (
              (
                \[
                |
                \:{1,2}
              ){1}
              [\w\-_\d\*\^\~\|\=\"\$]+
              (
                \([^\)\;]+\)
              )?
              \]?
            )
          )+
          [\n\,\s\>\+\~]*
        )+
      \{
      [^\}]*
      \}
      \n*
    */
    var cssRegex = /^[\s\t]*(((([\.\#]?[\w\-_\d]+)|\*)|((\[|\:{1,2}){1}[\w\-_\d\*\^\~\|\=\"\$]+(\([^\)\;]+\))?\]?))+[\n\,\s\>\+\~]*)+\{[^\}]*\}\n*/gm
    var cssRegexRes, returnLang
    if(!jcssString) return false
    cssRegexRes = cssRegex.exec(jcssString)
    if(!cssRegexRes) return ['js', jcssString, false]
    returnLang = jcssString.indexOf(cssRegexRes[0]) === 0 ? 'css' : 'js'
    return [returnLang].concat(this.splitAroundSubstring(cssRegexRes[0], jcssString))
  },

  splitAroundSubstring: function (substring, string) {
    var substringFirst = string.indexOf(substring)
    var substringLast = substringFirst + substring.length
    if(substringFirst === 0) {
      return [string.substr(0, substringLast), string.substr(substringLast)]
    } else {
      return [string.substr(0, substringFirst), string.substr(substringFirst)]
    }
  },

  interpret: function (someArr) {
    return (someArr[0] == 'js' ? this.exec(someArr[1]) : someArr[1])
  },

  parse: function (jcssString) {
    var splitJcss = []
    var buffer = ''
    var parsedCss = ''
    if(typeof jcssString != 'string') return false
    do {
      splitJcss = this.split(jcssString)
      parsedCss += (buffer = this.interpret(splitJcss))
      if(buffer === false) return false
    } while (jcssString = splitJcss[2])
    return parsedCss
  }
}
