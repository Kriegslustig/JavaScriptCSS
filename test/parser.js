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
    })
  })

  describe('split', function () {
    var testJcss
    var testCss
    var parseReturn
    before(function () {
      testJcss = '\n        div {\n          display: block;\n        }\n        css(".class { display: none; }")\n      '
      testCss = {css:  '\n        div {\n          display: block;\n        }',
        js:'\n        css(".class { display: none; }")\n      '}
      parseReturn = parser.split(testJcss)
    })
    it('should return an array of two arrays with the inner array having js or css in the first position and a string at the second', function () {
      assert.equal('object', typeof parseReturn)
      assert.equal(2, parseReturn[0].length)
      assert.ok(parseReturn[0][0] == 'js' || parseReturn[0][0] == 'css')
      assert.equal('string', typeof parseReturn[0][1])
    })
    it('should interpret line endings before and after css as css', function () {
      assert.equal('\n', parseReturn[0][1][0])
      assert.equal('\n', parseReturn[0][1][parseReturn[0][1].length - 1])
    })
    it('should be able to handle only js or only css', function () {
      assert.equal('css("div{display:block;}")', parser.split('css("div{display:block;}")')[0][1])
      assert.equal('div{display:block;}', parser.split('div{display:block;}')[0][1])
      assert.equal('', parser.split('div{display:block;}')[1][1])
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