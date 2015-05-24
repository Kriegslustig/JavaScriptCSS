var assert = require('assert')
var utilities = require('../lib/utilities.js')

describe('utilities', function () {
  describe('caller', function () {
    it('should take a string as a first argument', function () {
      assert.ok(utilities.caller('0'))
    })
    it('should return a function', function () {
      assert.equal('function', typeof utilities.caller('0'))
    })
    it('should return a function that calles a function on its argument, the function name is passed to caller', function () {
      assert.ok(utilities.caller('0')([function () {return true}]))
    })
    it('should run the function passed to it if no key is specified', function () {
      assert.ok(utilities.caller()(function () {return true}))
    })
  })

  describe('runArray', function () {
    it('should take an array as an argument', function () {
      assert.ok(utilities.runArray([]))
    })
    it('should run all functions in an array', function () {
      var tst = 0
      utilities.runArray([function () {tst++}, function () {tst++}])
      assert.equal(2, tst)
    })
    it('should return an array', function () {
      assert.equal('object', typeof utilities.runArray([function () {return true}, function () {return false}]))
      assert.equal(true, utilities.runArray([function () {return true}, function () {return false}])[0])
    })
  })

  describe('stringFormat', function () {
    it('should return a string', function () {
      assert.equal('string', typeof utilities.stringFormat('%s', [], '%s'))
    })
    it('should take iterate over the second argument and replace the third argument in the first with their values', function () {
      assert.equal('test', utilities.stringFormat('%s', ['test'], '%s'))
      assert.equal('testtest', utilities.stringFormat('%s%s', ['test','test'], '%s'))
    })
  })
})