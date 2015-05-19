var vm = require('vm')
var util = require('util')
var _ = require('underscore')

var fileHandler = require('../lib/fileHandler.js')
var utilities = require('../lib/utilities.js')

module.exports = {
  stateJcssVars: require('../helpers/helpers.js'),

  funcsToString: function (funcArr) {
    var returnString
    funcArr = [''].concat(funcArr.map(utilities.caller('toString')))
    return funcArr.join('\n')
  },

  /*
   * The manipulators are passed to the JCSS as context.
   * Only the an directly manipulate the returnString
   */
  manipulators: [
    function css (cssString) {
      returnString += cssString
    }
  ],

  /*
   * Utilities are objects availible within the JS part of a jcss file that live in global space
   */
  utlilities: {
    _: _,
    include: this.include
  },

  exec: function (javaScriptString) {
    var returnString = ''
    var sandbox = _.extend({
      $: this.stateJcssVars,
      returnString: '',
    }, this.utilities)
    console.log(sandbox)
    try {
      vm.runInNewContext(javaScriptString + this.funcsToString(this.manipulators), sandbox)
    } catch (e) {
      console.log('Exception in your jcss')
      console.log(javaScriptString)
      console.log(e)
      return false
    }
    this.stateJcssVars = sandbox.$
    return sandbox.returnString
  },

  parseCssVars: function (cssString) {
    /*
      \$\.
      [\w\,\.\d\_\-\$]+
      (
        \(
        [^\(\)]*
        \)
      )*
    */
    var self = this
    var varRegex = /\$\.[\w\,\.\d\_\-\$]+(\([^\(\)]*\))*/gm
    if(!cssString) return '';
    cssString = cssString.replace(varRegex, function (match) {
      var $ = self.stateJcssVars
      return eval(match)
    })
    return cssString
  },

  split: function (jcssString) {
    /*
      ^[\s\t]*
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
    return (someArr[0] == 'js' ? this.exec(someArr[1]) : this.parseCssVars(someArr[1]))
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
