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

  include: function (fileName) {
    var fileString = this.parse(fileHandler.read(fileName)) || ''
    return fileString
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
   * Utilities are objects availible within the JS part of a jsheets file that live in global space
   */
  utilities: {
    _: _
  },

  exec: function (javaScriptString) {
    var returnString = ''
    var sandbox = _.extend({
      $: this.stateJcssVars,
      returnString: '',
    }, this.utilities)
    try {
      vm.runInNewContext(javaScriptString + this.funcsToString(this.manipulators), sandbox)
    } catch (e) {
      console.log('Exception in your jsheets')
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

  split: function (jsheetsString) {
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
    if(!jsheetsString) return false
    cssRegexRes = cssRegex.exec(jsheetsString)
    if(!cssRegexRes) return ['js', jsheetsString, false]
    returnLang = jsheetsString.indexOf(cssRegexRes[0]) === 0 ? 'css' : 'js'
    return [returnLang].concat(this.splitAroundSubstring(cssRegexRes[0], jsheetsString))
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

  makeIncludes: function (jsheetsString) {
    var self = this
    var includeRegex = /include\((\'|\")([^\)]*)\1\)/gm
    jsheetsString = jsheetsString.replace(includeRegex, function (match, g1, g2) {
      return self.include(g2)
    })
    return jsheetsString
  },

  parse: function (jsheetsString) {
    var splitJcss = []
    var buffer = ''
    var parsedCss = ''
    if(typeof jsheetsString != 'string') return false
    jsheetsString = this.makeIncludes(jsheetsString)
    do {
      splitJcss = this.split(jsheetsString)
      parsedCss += (buffer = this.interpret(splitJcss))
      if(buffer === false) return false
    } while (jsheetsString = splitJcss[2])
    return parsedCss
  }
}
