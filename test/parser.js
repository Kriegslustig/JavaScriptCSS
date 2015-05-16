var assert = require('assert')

var parser = require('../lib/parser.js')

describe('parser', function () {
  describe('parse', function () {})
  describe('splitJS', function () {
    var testJcss = '\
      div {\
        display: block;\
      }\
      css(".class { display: none; }")\
    '
    var testCss = {css:  '\
      div {\
        display: block;\
      }',
      js:'\
      css(".class { display: none; }")\
    '}
    it('should return an array of arrays with the inner array having js or css in the first position and a string at the second', function () {
      var parseReturn = parser.splitJS(testJcss)
      assert.equal('object', typeof parseReturn)
      assert.equal(2, parseReturn[0].length)
      assert.ok(parseReturn[0][0] == 'js' || parseReturn[0][0] == 'css')
      assert.equal('string', typeof parseReturn[0][1])
    })
    it('should interpret line endings before and after css as css', function () {
      assert.equal('\n', parseReturn[0][1][0])
      assert.equal('\n', parseReturn[0][1][parseReturn[0][1].length - 1])
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