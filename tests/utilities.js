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
      assert.equal(2, utilities.runArray([function () {tst++}, function () {tst++}]))
    })
  })
})