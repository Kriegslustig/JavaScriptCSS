var assert = require('assert')
var fs = require('fs')

var Parser = require('../lib/parser.js')

describe('parser', function () {
  describe('parse', function () {
    it('should return a string', function () {
      var testParser = new Parser
      assert.equal('string', typeof testParser.parse(''))
    })
    it('should return false if there\'s invalid any javascript in the jsheets', function () {
      var testParser = new Parser
      assert.ok(!testParser.parse('asdf'))
    })
    it('should take jsheets and return css', function () {
      var testParser = new Parser
      assert.equal('asdf', testParser.parse('["a", "s", "d", "f"].forEach(function (value) { css(value) })'))
      assert.equal('div {\n  display: block;\n}\ntroll', testParser.parse('div {\n  display: block;\n}\n  css(\'troll\')'))
      assert.equal('div {\n          display: block;\n        }\ntrolltrolltrolltrolltrolltrolltrolltrolltrolltroll\n        div { display: hidden; }', testParser.parse('div {\n          display: block;\n        }\n        \n        for(var i = 10; i > 0; i--) {\n          css(\'troll\')\n        }\n\n        div { display: hidden; }'))
    })
    it('should return false if false is passed to it', function () {
      var testParser = new Parser
      assert.equal(false, testParser.parse(false))
    })

    it('should be able to set, use and reset variables', function () {
      var testParser = new Parser
      var testString
      testParser.parse('$.someString = \'someString\'')
      assert.equal('someString', testParser.context['$']['someString'])
      testString = testParser.parse('$.someString = \'someOtherString\' \n div {display:$.someString}')
      assert.equal(' div {display:someOtherString}', testString)
      testString = testParser.parse('\n div {display:$.someString}')
      assert.equal('\n div {display:someOtherString}', testString)
    })

    it('Should keep variables in global space', function () {
      var testParser = new Parser
      assert.equal('a{...}\ntrue', testParser.parse('var testVar = true \na{...}\ncss(testVar)'))
    })

    it('should run the onEOF hook', function () {
      var testParser = new Parser
      testParser.context.onEOF = [function () {return 'css'}]
      assert.equal('\ncss', testParser.parse(''))
    })

    describe('onEOF', function () {
      it('should add the returned value of a hook to the parsed css string', function () {
        var testParser = new Parser
        testParser.context.onEOF = [function () {return 'css'}]
        assert.equal('\ncss', testParser.parse(''))
      })
    })
  })

  describe('interpret', function () {
    it('should exec js if the first position is js', function () {
      var testParser = new Parser
      assert.equal('asdf', testParser.interpret(['js', '["a", "s", "d", "f"].forEach(function (value) { css(value) })']))
    })

    it('should return the passed string if the first position is css', function () {
      var testParser = new Parser
      assert.equal('display: block', testParser.interpret(['css', 'display: block']))
    })
  })

  describe('split', function () {
    var testJcss
    var testCss
    var parseReturn
    before(function () {
      var testParser = new Parser
      testJcss = '\n        div {\n          display: block;\n        }\n\n        css(".class { display: none; }")\n      '
      testCss = {css:  '\n        div {\n          display: block;\n        }',
        js:'\n        css(".class { display: none; }")\n      '}
      parseReturn = testParser.split(testJcss)
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
      var testParser = new Parser
      assert.equal('css("div{display:block;}")', testParser.split('css("div{display:block;}")')[1])
      assert.equal('div{display:block;}', testParser.split('div{display:block;}')[1])
    })
    it('should return false if the passed string is empty', function () {
      var testParser = new Parser
      assert.equal(false, testParser.split(''))
    })
    it('should mark css and js as such', function () {
      var testParser = new Parser
      assert.equal('div {\n          display: block;\n        }\n',
        testParser.split('div {\n          display: block;\n        }\n        \n        for(var i = 10; i < 0; i--) {\n          css(\'troll\')\n        }\n        ')[1])
      assert.equal('        \n        for(var i = 10; i < 0; i--) {\n          css(\'troll\')\n        }\n        ',
        testParser.split('        \n        for(var i = 10; i < 0; i--) {\n          css(\'troll\')\n        }\n        ')[1])
    })
    it('should return the rest as the third position and false if there is nothing left', function () {
      var testParser = new Parser
      assert.equal('        \n        for(var i = 10; i < 0; i--) {\n          css(\'troll\')\n        }\n        ',
        testParser.split('div {\n          display: block;\n        }\n        \n        for(var i = 10; i < 0; i--) {\n          css(\'troll\')\n        }\n        ')[2])
      assert.equal(false,
        testParser.split('div {\n          display: block;\n        }')[2])
    })
    it('should know all css selectors', function () {
      var testParser = new Parser
      var testCss = '{display: block;}'
      assert.equal('css', testParser.split('*' + testCss)[0])
      assert.equal('css', testParser.split('E' + testCss)[0])
      assert.equal('css', testParser.split('E[foo]' + testCss)[0])
      assert.equal('css', testParser.split('E[foo="bar"]' + testCss)[0])
      assert.equal('css', testParser.split('E[foo~="bar"]' + testCss)[0])
      assert.equal('css', testParser.split('E[foo^="bar"]' + testCss)[0])
      assert.equal('css', testParser.split('E[foo$="bar"]' + testCss)[0])
      assert.equal('css', testParser.split('E[foo*="bar"]' + testCss)[0])
      assert.equal('css', testParser.split('E[foo|="en"]' + testCss)[0])
      assert.equal('css', testParser.split('E:root' + testCss)[0])
      assert.equal('css', testParser.split('E:nth-child(n)' + testCss)[0])
      assert.equal('css', testParser.split('E:nth-last-child(n)' + testCss)[0])
      assert.equal('css', testParser.split('E:nth-of-type(n)' + testCss)[0])
      assert.equal('css', testParser.split('E:nth-last-of-type(n)' + testCss)[0])
      assert.equal('css', testParser.split('E:first-child' + testCss)[0])
      assert.equal('css', testParser.split('E:last-child' + testCss)[0])
      assert.equal('css', testParser.split('E:first-of-type' + testCss)[0])
      assert.equal('css', testParser.split('E:last-of-type' + testCss)[0])
      assert.equal('css', testParser.split('E:only-child' + testCss)[0])
      assert.equal('css', testParser.split('E:only-of-type' + testCss)[0])
      assert.equal('css', testParser.split('E:empty' + testCss)[0])
      assert.equal('css', testParser.split('E:link' + testCss)[0])
      assert.equal('css', testParser.split('E:visited' + testCss)[0])
      assert.equal('css', testParser.split('E:active' + testCss)[0])
      assert.equal('css', testParser.split('E:hover' + testCss)[0])
      assert.equal('css', testParser.split('E:focus' + testCss)[0])
      assert.equal('css', testParser.split('E:target' + testCss)[0])
      assert.equal('css', testParser.split('E:lang(fr)' + testCss)[0])
      assert.equal('css', testParser.split('E:enabled' + testCss)[0])
      assert.equal('css', testParser.split('E:disabled' + testCss)[0])
      assert.equal('css', testParser.split('E:checked' + testCss)[0])
      assert.equal('css', testParser.split('E::first-line' + testCss)[0])
      assert.equal('css', testParser.split('E::first-letter' + testCss)[0])
      assert.equal('css', testParser.split('E::before' + testCss)[0])
      assert.equal('css', testParser.split('E::after' + testCss)[0])
      assert.equal('css', testParser.split('E.warning' + testCss)[0])
      assert.equal('css', testParser.split('E#myid' + testCss)[0])
      assert.equal('css', testParser.split('E:not(s)' + testCss)[0])
      assert.equal('css', testParser.split('E F' + testCss)[0])
      assert.equal('css', testParser.split('E > F' + testCss)[0])
      assert.equal('css', testParser.split('E + F' + testCss)[0])
      assert.equal('css', testParser.split('E ~ F' + testCss)[0])
    })

    it('should be able to recognize mediaqueries as such', function () {
      var testParser = new Parser
        assert.equal('css', testParser.split('@media all and (min-width:500px) { … }')[0])
        assert.equal('css', testParser.split('@media (min-width:500px) { … }')[0])
        assert.equal('css', testParser.split('@media (orientation: portrait) { … }')[0])
        assert.equal('css', testParser.split('@media all and (orientation: portrait) { … }')[0])
        assert.equal('css', testParser.split('@media screen and (color), projection and (color) { … }')[0])
        assert.equal('css', testParser.split('@media all and (min-color: 2) { … }')[0])
        assert.equal('css', testParser.split('@media all { … }')[0])
        assert.equal('css', testParser.split('@media { … }')[0])
    })

    it('should recognize all js as not css', function () {
      var testParser = new Parser
      assert.equal('js', testParser.split('if(true) {return false}')[0])
      assert.equal('js', testParser.split('if(x = y) return something')[0])
      assert.equal('js', testParser.split('while(someFun()) {i++}')[0])
      assert.equal('js', testParser.split('arr[0] = {i: y}')[0])
      assert.equal('js', testParser.split('arr[\'d\'] = {i: y}')[0])
      assert.equal('js', testParser.split('arr[\'d\']={i: y}')[0])
    })

    it('should pass all css in strings as javascript', function () {
      var testParser = new Parser
      assert.equal('js', testParser.split('css(\'\
        div {\
          display: block;\
        }\')')[0])
      assert.equal('js', testParser.split('css(\'\n        div {\n          display: block;\n        }\')')[0])
    })
  })

  describe('parseCssVars', function () {
    it('should take a string and return one', function () {
      var testParser = new Parser
      assert.equal('string', typeof testParser.parseCssVars(''))
    })
    it('should replace variables starting with `$.` with its values', function () {
      var testParser = new Parser
      testParser.context.$ = { s: 'something' }
      assert.equal('something', testParser.parseCssVars('$.s'))
    })
    it('should replace function calls starting with `$.` with its return values', function () {
      var testParser = new Parser
      var someString = 'someString'
      testParser.context.$ = { f: function () { return someString } }
      assert.equal(someString, testParser.parseCssVars('$.f()'))
    })
    it('should be able to handle arguments passed to functions', function () {
      var testParser = new Parser
      testParser.context.$ = { add: function (n0, n1) { return n0 + n1 } }
      assert.equal(2, testParser.parseCssVars('$.add(1,1)'))
    })
    it('should be able to pick out vars in the middle of css', function () {
      var testParser = new Parser
      testParser.context.$ = { str: 'block' }
      assert.equal('div { display: block; }', testParser.parseCssVars('div { display: $.str; }'))
    })
  })

  describe('splitAroundSubstring', function () {
    it('should take two strings as arguments', function () {
      var testParser = new Parser
      assert.ok(testParser.splitAroundSubstring(' 1', ' 1 '))
    })
    it('should return an array of two strings', function () {
      var testParser = new Parser
      assert.equal('object', typeof testParser.splitAroundSubstring(' 1', ' 1 '))
      assert.equal(2, testParser.splitAroundSubstring(' 1', ' 1 ').length)
      assert.equal('string', typeof testParser.splitAroundSubstring(' 1', ' 1 ')[0])
      assert.equal('string', typeof testParser.splitAroundSubstring(' 1', ' 1 ')[1])
    })
    it('should return two substrings of the second', function () {
      var testParser = new Parser
      var s1 = ' 1'
      var s2 = ' 1 '
      assert.ok(s2.indexOf(testParser.splitAroundSubstring(s1, s2)[0]) > -1)
      assert.ok(s2.indexOf(testParser.splitAroundSubstring(s1, s2)[1]) > -1)
    })
    it('should return everything before the passed substring as the first return value if there is anything', function () {
      var testParser = new Parser
      assert.equal(' ', testParser.splitAroundSubstring('1 ', ' 1 ')[0])
    })
    it('should return a string including the substring as the second return value if the substring isn\'t at the start of the string', function () {
      var testParser = new Parser
      assert.equal('1 -', testParser.splitAroundSubstring('1 ', ' 1 -')[1])
    })
  })

  describe('exec', function () {
    it('should return a string', function () {
      var testParser = new Parser
      assert.equal('string', typeof testParser.exec(''))
    })
    it('should return false if the string that is passed isn\'t valid JS.', function () {
      var testParser = new Parser
      assert.equal(false, testParser.exec('yourmum'))
    })
    it('should provide a function `css` to the JS beeing execute', function () {
      var testParser = new Parser
      assert.equal('display: block', testParser.exec('css("display: block")'))
    })
    it('should exec JS', function () {
      var testParser = new Parser
      assert.equal('asdf', testParser.exec('["a", "s", "d", "f"].forEach(function (value) { css(value) })'))
    })

    it('should provide the require methode', function () {
      var testParser = new Parser
      assert.equal('function', testParser.exec('css(typeof require)'))
      assert.equal('function', testParser.exec('css(typeof require(\'underscore\'))'))
    })
  })

  describe('funcsToString', function () {
    it('should take an array of functions as an argument', function () {
      var testParser = new Parser
      assert.ok(testParser.funcsToString([function a () {}]))
    })
    it('should return a string', function () {
      var testParser = new Parser
      assert.equal('string', typeof testParser.funcsToString([function a () {}]))
    })
    it('should join the functions with newlines', function () {
      var testParser = new Parser
      assert.ok(testParser.funcsToString([function a () {}, function a () {}]).indexOf('\n') > -1)
    })
    it('should add a newline in to the beginning of the string', function () {
      var testParser = new Parser
      assert.equal('\n', testParser.funcsToString([function a () {}])[0])
    })
  })

  describe('include', function () {
    var testDirectory = 'test7'
    var testFile = testDirectory + '/testfile.jsheet'
    before(function () {
      fs.mkdirSync(testDirectory)
      fs.writeFileSync(testFile, ' ')
    })
    it('should read and parse a jsheets file', function () {
      var testParser = new Parser
      var testFile = './testfile.jsheet'
      fs.writeFileSync(testFile, 'css(\'div{display: block}\')')
      assert.equal('div{display: block}', testParser.include(testFile))
      fs.unlink(testFile)
    })
    it('should log an error and return an empty string if the jsheets is invalid or if the file doesn\'t exsist', function () {
      var testParser = new Parser
      var testFile = './testfile.jsheet'
      assert.equal('', testParser.include('asddgere.cevrscs'))
      fs.writeFileSync(testFile, 'css(\'div{display: block}\')yoomum')
      assert.equal('', testParser.include(testFile))
      fs.unlink(testFile)
    })
    it('execute in a seperate context, but merge the $ objects', function () {
      var testParser = new Parser
      var testFile = './testfile.jsheet'
      testParser.context.globalVar = true
      fs.writeFileSync(testFile, '$.testVar = true; globalVar = false')
      testParser.include(testFile)
      assert.equal(true, testParser.context.$.testVar)
      assert.ok(testParser.context.globalVar)
      fs.unlink(testFile)
    })
    it('should be able to take whole directories as an argument', function () {
      var testParser = new Parser
      assert.equal('string', typeof testParser.include(testDirectory))
    })
    after(function () {
      fs.unlinkSync(testFile)
      fs.rmdirSync(testDirectory)
    })
  })

  describe('makeIncludes', function () {
    it('should replace calles to include in parsed jsheets files', function () {
      var testParser = new Parser
      var testFile = './testfile.jsheet'
      fs.writeFileSync(testFile, 'css(\'div{display: block}\')')
      assert.equal('div{display: block}', testParser.makeIncludes('include \'' + testFile + '\''))
      fs.unlink(testFile)
    })
  })

  describe('cleanContext', function () {
    it('should clear the returnString', function () {
      var testParser = new Parser
      testParser.context.returnString = 'css'
      testParser.cleanContext()
      assert.equal('', testParser.context.returnString)
    })
  })

  describe('mergeContext', function () {
    it('should merge the passed context with this.context', function () {
      var testParser = new Parser
      var test2Parser = new Parser
      testParser.context.somevar = true
      testParser.mergeContext(test2Parser.context)
      assert.ok(testParser.context.somevar)
    })
  })
})