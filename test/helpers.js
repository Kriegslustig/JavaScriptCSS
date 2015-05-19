var helpers = require('../lib/helpers.js')

describe('helpers', function () {
  describe('$', function () {
    it('should be able to parse an expression and return the pased value', function () {
      assert.equal(true, helpers.$(true))
    })
  })
})