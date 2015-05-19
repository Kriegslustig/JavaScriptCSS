var assert = require('assert')
var fs = require('fs')

var parser = require('../lib/parser.js')

describe('parser', function () {
  describe('parse', function () {
    it('should return a string', function () {
      assert.equal('string', typeof parser.parse(''))
    })
    it('should return false if there\'s invalid any javascript in the jcss', function () {
      assert.ok(!parser.parse('asdf'))
    })
    it('should take jcss and return css', function () {
      assert.equal('asdf', parser.parse('["a", "s", "d", "f"].forEach(function (value) { css(value) })'))
      assert.equal('div {\n  display: block;\n}\ntroll', parser.parse('div {\n  display: block;\n}\n  css(\'troll\')'))
      assert.equal('div {\n          display: block;\n        }\ntrolltrolltrolltrolltrolltrolltrolltrolltrolltroll\n        div { display: hidden; }', parser.parse('div {\n          display: block;\n        }\n        \n        for(var i = 10; i > 0; i--) {\n          css(\'troll\')\n        }\n\n        div { display: hidden; }'))
    })
    it('should return false if false is passed to it', function () {
      assert.equal(false, parser.parse(false))
    })

    it('should be able to set, use and reset variables', function () {
      var testString
      parser.parse('$.someString = \'someString\'')
      assert.equal('someString', parser.stateJcssVars['someString'])
      testString = parser.parse('$.someString = \'someOtherString\' \n div {display:$.someString}')
      assert.equal(' div {display:someOtherString}', testString)
      testString = parser.parse('\n div {display:$.someString}')
      assert.equal('\n div {display:someOtherString}', testString)
    })
  })

  describe('interpret', function () {
    it('should exec js if the first position is js', function () {
      assert.equal('asdf', parser.interpret(['js', '["a", "s", "d", "f"].forEach(function (value) { css(value) })']))
    })
    it('should return the passed string if the first position is css', function () {
      assert.equal('display: block', parser.interpret(['css', 'display: block']))
    })
  })

  describe('split', function () {
    var testJcss
    var testCss
    var parseReturn
    before(function () {
      testJcss = '\n        div {\n          display: block;\n        }\n\n        css(".class { display: none; }")\n      '
      testCss = {css:  '\n        div {\n          display: block;\n        }',
        js:'\n        css(".class { display: none; }")\n      '}
      parseReturn = parser.split(testJcss)
    })
    it('should return an array of three strings, the first is either js or css, the second is code and the third is the rest', function () {
      assert.equal('object', typeof parseReturn)
      assert.equal('string', typeof parseReturn[1])
      assert.equal('string', typeof parseReturn[0])
      assert.equal(3, parseReturn.length)
      assert.ok(parseReturn[0] == 'js' || parseReturn[0] == 'css')
    })
    it('should interpret all line endings before and after css as css', function () {
      assert.equal('\n', parseReturn[1][0])
      assert.equal('\n', parseReturn[1][parseReturn[1].length - 1])
      assert.equal('\n', parseReturn[1][parseReturn[1].length - 2])
    })
    it('should be able to handle only js or only css', function () {
      assert.equal('css("div{display:block;}")', parser.split('css("div{display:block;}")')[1])
      assert.equal('div{display:block;}', parser.split('div{display:block;}')[1])
    })
    it('should return false if the passed string is empty', function () {
      assert.equal(false, parser.split(''))
    })
    it('should mark css and js as such', function () {
      assert.equal('div {\n          display: block;\n        }\n',
        parser.split('div {\n          display: block;\n        }\n        \n        for(var i = 10; i < 0; i--) {\n          css(\'troll\')\n        }\n        ')[1])
      assert.equal('        \n        for(var i = 10; i < 0; i--) {\n          css(\'troll\')\n        }\n        ',
        parser.split('        \n        for(var i = 10; i < 0; i--) {\n          css(\'troll\')\n        }\n        ')[1])
    })
    it('should return the rest as the third position and false if there is nothing left', function () {
      assert.equal('        \n        for(var i = 10; i < 0; i--) {\n          css(\'troll\')\n        }\n        ',
        parser.split('div {\n          display: block;\n        }\n        \n        for(var i = 10; i < 0; i--) {\n          css(\'troll\')\n        }\n        ')[2])
      assert.equal(false,
        parser.split('div {\n          display: block;\n        }')[2])
    })
    it('should know all css selectors', function () {
      var testCss = '{display: block;}'
      assert.equal('css', parser.split('*' + testCss)[0])
      assert.equal('css', parser.split('E' + testCss)[0])
      assert.equal('css', parser.split('E[foo]' + testCss)[0])
      assert.equal('css', parser.split('E[foo="bar"]' + testCss)[0])
      assert.equal('css', parser.split('E[foo~="bar"]' + testCss)[0])
      assert.equal('css', parser.split('E[foo^="bar"]' + testCss)[0])
      assert.equal('css', parser.split('E[foo$="bar"]' + testCss)[0])
      assert.equal('css', parser.split('E[foo*="bar"]' + testCss)[0])
      assert.equal('css', parser.split('E[foo|="en"]' + testCss)[0])
      assert.equal('css', parser.split('E:root' + testCss)[0])
      assert.equal('css', parser.split('E:nth-child(n)' + testCss)[0])
      assert.equal('css', parser.split('E:nth-last-child(n)' + testCss)[0])
      assert.equal('css', parser.split('E:nth-of-type(n)' + testCss)[0])
      assert.equal('css', parser.split('E:nth-last-of-type(n)' + testCss)[0])
      assert.equal('css', parser.split('E:first-child' + testCss)[0])
      assert.equal('css', parser.split('E:last-child' + testCss)[0])
      assert.equal('css', parser.split('E:first-of-type' + testCss)[0])
      assert.equal('css', parser.split('E:last-of-type' + testCss)[0])
      assert.equal('css', parser.split('E:only-child' + testCss)[0])
      assert.equal('css', parser.split('E:only-of-type' + testCss)[0])
      assert.equal('css', parser.split('E:empty' + testCss)[0])
      assert.equal('css', parser.split('E:link' + testCss)[0])
      assert.equal('css', parser.split('E:visited' + testCss)[0])
      assert.equal('css', parser.split('E:active' + testCss)[0])
      assert.equal('css', parser.split('E:hover' + testCss)[0])
      assert.equal('css', parser.split('E:focus' + testCss)[0])
      assert.equal('css', parser.split('E:target' + testCss)[0])
      assert.equal('css', parser.split('E:lang(fr)' + testCss)[0])
      assert.equal('css', parser.split('E:enabled' + testCss)[0])
      assert.equal('css', parser.split('E:disabled' + testCss)[0])
      assert.equal('css', parser.split('E:checked' + testCss)[0])
      assert.equal('css', parser.split('E::first-line' + testCss)[0])
      assert.equal('css', parser.split('E::first-letter' + testCss)[0])
      assert.equal('css', parser.split('E::before' + testCss)[0])
      assert.equal('css', parser.split('E::after' + testCss)[0])
      assert.equal('css', parser.split('E.warning' + testCss)[0])
      assert.equal('css', parser.split('E#myid' + testCss)[0])
      assert.equal('css', parser.split('E:not(s)' + testCss)[0])
      assert.equal('css', parser.split('E F' + testCss)[0])
      assert.equal('css', parser.split('E > F' + testCss)[0])
      assert.equal('css', parser.split('E + F' + testCss)[0])
      assert.equal('css', parser.split('E ~ F' + testCss)[0])
    })

    it('should recognize all js as not css', function () {
      assert.equal('js', parser.split('if(true) {return false}')[0])
      assert.equal('js', parser.split('if(x = y) return something')[0])
      assert.equal('js', parser.split('while(someFun()) {i++}')[0])
      assert.equal('js', parser.split('arr[0] = {i: y}')[0])
      assert.equal('js', parser.split('arr[\'d\'] = {i: y}')[0])
      assert.equal('js', parser.split('arr[\'d\']={i: y}')[0])
    })
  })

  describe('parseCssVars', function () {
    it('should take a string and return one', function () {
      assert.equal('string', typeof parser.parseCssVars(''))
    })
    it('should replace variables starting with `$.` with its values', function () {
      parser.stateJcssVars = { s: 'something' }
      assert.equal('something', parser.parseCssVars('$.s'))
    })
    it('should replace function calls starting with `$.` with its return values', function () {
      var someString = 'someString'
      parser.stateJcssVars = { f: function () { return someString } }
      assert.equal(someString, parser.parseCssVars('$.f()'))
    })
    it('should be able to handle arguments passed to functions', function () {
      parser.stateJcssVars = { add: function (n0, n1) { return n0 + n1 } }
      assert.equal(2, parser.parseCssVars('$.add(1,1)'))
    })
    it('should be able to pick out vars in the middle of css', function () {
      parser.stateJcssVars = { str: 'block' }
      assert.equal('div { display: block; }', parser.parseCssVars('div { display: $.str; }'))
    })
  })

  describe('splitAroundSubstring', function () {
    it('should take two strings as arguments', function () {
      assert.ok(parser.splitAroundSubstring(' 1', ' 1 '))
    })
    it('should return an array of two strings', function () {
      assert.equal('object', typeof parser.splitAroundSubstring(' 1', ' 1 '))
      assert.equal(2, parser.splitAroundSubstring(' 1', ' 1 ').length)
      assert.equal('string', typeof parser.splitAroundSubstring(' 1', ' 1 ')[0])
      assert.equal('string', typeof parser.splitAroundSubstring(' 1', ' 1 ')[1])
    })
    it('should return two substrings of the second', function () {
      var s1 = ' 1'
      var s2 = ' 1 '
      assert.ok(s2.indexOf(parser.splitAroundSubstring(s1, s2)[0]) > -1)
      assert.ok(s2.indexOf(parser.splitAroundSubstring(s1, s2)[1]) > -1)
    })
    it('should return everything before the passed substring as the first return value if there is anything', function () {
      assert.equal(' ', parser.splitAroundSubstring('1 ', ' 1 ')[0])
    })
    it('should return a string including the substring as the second return value if the substring isn\'t at the start of the string', function () {
      assert.equal('1 -', parser.splitAroundSubstring('1 ', ' 1 -')[1])
    })
  })

  describe('exec', function () {
    it('should return a string', function () {
      assert.equal('string', typeof parser.exec(''))
    })
    it('should return false if the string that is passed isn\'t valid JS.', function () {
      assert.equal(false, parser.exec('yourmum'))
    })
    it('should provide a function `css` to the JS beeing execute', function () {
      assert.equal('display: block', parser.exec('css("display: block")'))
    })
    it('should exec JS', function () {
      assert.equal('asdf', parser.exec('["a", "s", "d", "f"].forEach(function (value) { css(value) })'))
    })
  })

  describe('funcsToString', function () {
    it('should take an array of functions as an argument', function () {
      assert.ok(parser.funcsToString([function a () {}]))
    })
    it('should return a string', function () {
      assert.equal('string', typeof parser.funcsToString([function a () {}]))
    })
    it('should join the functions with newlines', function () {
      assert.ok(parser.funcsToString([function a () {}, function a () {}]).indexOf('\n') > -1)
    })
    it('should add a newline in to the beginning of the string', function () {
      assert.equal('\n', parser.funcsToString([function a () {}])[0])
    })
  })

  describe('include', function () {
    it('should read and parse a jcss file', function () {
      var testFile = './testfile.jcss'
      fs.writeFileSync(testFile, 'css(\'div{display: block}\')')
      assert.equal('div{display: block}', parser.include(testFile))
      fs.unlink(testFile)
    })
    it('should log an error and return an empty string if the jcss is invalid or if the file doesn\'t exsist', function () {
      var testFile = './testfile.jcss'
      assert.equal('', parser.include('asddgere.cevrscs'))
      fs.writeFileSync(testFile, 'css(\'div{display: block}\')yoomum')
      assert.equal('', parser.include(testFile))
      fs.unlink(testFile)
    })
  })
})