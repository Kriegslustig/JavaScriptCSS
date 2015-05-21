var vm = require('vm')
var util = require('util')
var _ = require('underscore')

var fileHandler = require('../lib/fileHandler.js')
var utilities = require('../lib/utilities.js')

function createContext () {
  var sandbox = {
    returnString: '',
    $: require('../helpers/helpers.js'),
    css: function (cssString) {
      sandbox.returnString += cssString
    },
    onDone: [],
    _: _
  }
  return vm.createContext(sandbox)
}

module.exports = function () { return {
  funcsToString: function (funcArr) {
    var returnString
    funcArr = [''].concat(funcArr.map(utilities.caller('toString')))
    return funcArr.join('\n')
  },

  include: function (fileName) {
    var fileString = this.parse(fileHandler.read(fileName)) || ''
    return fileString
  },

  context: createContext(),

  exec: function (javaScriptString) {
    var returnString = ''
    this.context.returnString = ''
    try {
      vm.runInContext(javaScriptString, this.context)
    } catch (e) {
      console.log('Exception in your jsheets')
      console.log(javaScriptString)
      console.log(e)
      return false
    }
    returnString = this.context.returnString
    this.context.returnString = ''
    return returnString
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
      var $ = self.context.$
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
        |
        (
          \@media\s
          [^\{]*
        )
      )
      \{
      [^\}]*
      \}
      \n*
    */
    var cssRegex = /^[\s\t]*((((([\.\#]?[\w\-_\d]+)|\*)|((\[|\:{1,2}){1}[\w\-_\d\*\^\~\|\=\"\$]+(\([^\)\;]+\))?\]?))+[\n\,\s\>\+\~]*)+|(\@media\s[^\{]*))\{[^\}]*\}\n*/gm
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

  cleanContext: function () {
    this.context.returnValue = ''
  },

  mergeContext: function (someContext) {
    return (this.context = _.extend(someContext, this.context))
  },

  initialize: function () {
    this.context = createContext()
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
    vm.runInContext(
      '(' + utilities.runArray.toString() + ')' +
      '([' + this.context.onDone.toString() + '])',
      this.context)
    if(this.context.returnString) parsedCss += '\n' + this.context.returnString
    return parsedCss
  }
} }