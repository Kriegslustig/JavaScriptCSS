var assert = require('assert')
var vm = require('vm')

var Helpers = require('../helpers/helpers.js')

describe('helpers', function () {
  describe('()', function () {
    var helpers = new Helpers({})
    it('should be able to parse an expression and return the pased value', function () {
      assert.equal(true, helpers(true))
    })
  })

  describe('extend', function () {
    var context = {onEOF: []}
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
      })
      it('should add a function to onEOF', function () {
        onEOF = []
        assert.equal(undefined, helpers.extend.that(' ', 'div'))
        assert.equal('function', typeof context.onEOF[0])
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
        assert.equal(' , div {css}\n', context.onEOF[0]())
      })
    })
  })
  describe('calc', function () {
    var helpers = new Helpers({})
    it('should take a string as an argument', function () {
      assert.ok(helpers.calc('1 + 1'))
    })
    it('should return a string if it\'s passed a number with a unit', function () {
      assert.equal('string', typeof helpers.calc('1em + 1em'))
    })
    it('should return a number if it\'s passed a number without a unit', function () {
      assert.equal('number', typeof helpers.calc('1 + 1'))
    })
    it('should return false if there are mixed units', function () {
      assert.equal(false, helpers.calc('1px + 1em'))
    })
    it('should return a value in the same unit as the parameter', function () {
      assert.equal('2em', helpers.calc('1 + 1em'))
      assert.equal('12px', helpers.calc('3px + 9'))
    })
    it('should be able to handle calculation of any complexity', function () {
      assert.equal('24em', helpers.calc('48em / 2'))
      assert.equal('48em', helpers.calc('24em * 2'))
      assert.equal('4em', helpers.calc('24em * 2 / 12em'))
      assert.equal('144em', helpers.calc('24em * (12em / 2)'))
    })
    it('should replace %d in the first arg with the rest of the arguments, like printf', function () {
      var some = 3
      var all = '5em'
      assert.equal(4, helpers.calc('1 + %d', some))
      assert.equal('5.5em', helpers.calc('%d + %d / 2', some, all))
    })
  })
})
