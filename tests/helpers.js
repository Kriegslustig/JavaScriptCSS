var assert = require('assert')
var vm = require('vm')

var Helpers = require('../helpers/helpers.js')

describe('helpers', function () {
  describe('$', function () {
    var helpers = new Helpers({})
    it('should be able to parse an expression and return the pased value', function () {
      assert.equal(true, helpers.$(true))
    })
  })

  describe('extend', function () {
    var context = {onDone: []}
    var helpers = new Helpers(context)
    it('should be an object', function () {
      assert.equal('object', typeof helpers.extend)
    })
    it('should have a function add', function () {
      assert.equal('function', typeof helpers.extend.add)
    })
    it('should have a function that', function () {
      assert.equal('function', typeof helpers.extend.that)
    })
    describe('add', function () {
      it('should take two strings as arguments', function () {
        assert.equal(undefined, helpers.extend.add(' ', 'css'))
      })
      it('should add objects to extend.extendables', function () {
        assert.equal('object', typeof helpers.extend.extendables[' ']);
      })
    })
    describe('that', function () {
      it('should take two arguments', function () {
        assert.equal(undefined, helpers.extend.that(' ', ' '))
      })
      it('should only take strings for which there have been extendables added for as an argument', function () {
        assert.ok(helpers.extend.that('!', '') !== undefined)
        console.log(context)
      })
      it('should add a function to onDone', function () {
        onDone = []
        assert.equal(undefined, helpers.extend.that(' ', 'div'))
        assert.equal('function', typeof context.onDone[0])
      })
    })
    describe('extendMaker', function () {
      it('should return a function', function () {
        assert.equal('function', typeof helpers.extend.extendMaker(' '))
      })
      it('should return a function that returns a string', function () {
        assert.equal('string', typeof helpers.extend.extendMaker(' ')())
      })
    })
    after(function () {
      it('should add css blocks to the end of a file', function () {
        assert.equal(' , div {css}\n', context.onDone[0]())
      })
    })
  })
})
