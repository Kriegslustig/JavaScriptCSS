var assert = require('assert')

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
      assert.equal('div {\
          display: block;\
        }\
\
trolltrolltrolltrolltrolltrolltrolltroll\
        div { display: hidden; }', parser.parse('div {\
          display: block;\
        }\
        \
        for(var i = 10; i > 0; i--) {\
          css(\'troll\')\
        }\
        div { display: hidden; }'))
    })
    it('should return false if false is passed to it', function () {
      assert.equal(false, parser.parse(false))
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
      assert.equal('div {\
          display: block;\
        }\
',
        parser.split('div {\
          display: block;\
        }\
        \
        for(var i = 10; i < 0; i--) {\
          css(\'troll\')\
        }\
        ')[1])
      assert.equal('        \
        for(var i = 10; i < 0; i--) {\
          css(\'troll\')\
        }\
        ',
        parser.split('        \
        for(var i = 10; i < 0; i--) {\
          css(\'troll\')\
        }\
        ')[1])
    })
    it('should return the rest as the third position and false if there is nothing left', function () {
      assert.equal('        \
        for(var i = 10; i < 0; i--) {\
          css(\'troll\')\
        }\
        ',
        parser.split('div {\
          display: block;\
        }\
        \
        for(var i = 10; i < 0; i--) {\
          css(\'troll\')\
        }\
        ')[2])
      assert.equal(false,
        parser.split('div {\
          display: block;\
        }')[2])
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
      assert.equal('1 -', parser.splitAroundSubstring(' 1 -', '1 ')[1])
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
})