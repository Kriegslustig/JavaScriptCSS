var _ = require('underscore')

var utilities = require('../lib/utilities.js')

module.exports = function (context) {
  var helpers = function (expression) {
      return expression
  }
  _.extend(helpers, {
    extend: {
      extendables: {},
      add: function (selector, cssString) {
        this.extendables[selector] = {
          css: cssString,
          selectors: []
        }
      },
      that: function (extendable, selector) {
        if(!this.extendables[extendable]) return false
        this.extendables[extendable]['selectors'].push(selector)
        context.onEOF.push(this.extendMaker(extendable))
      },
      extendMaker: function (extendable) {
        var self = this
        return function () {
          var returnVal
          if(!self.extendables[extendable]) return ''
          returnVal = [extendable].concat(self.extendables[extendable].selectors).join(', ') + ' {' + self.extendables[extendable].css + '}\n'
          self.extendables[extendable] = false
          return returnVal
        }
      }
    },

    calc: function (calculation/*, formatParameters*/) {
      var unitsRegex = /[a-zA-Z]+/gm
      var unit
      calculation = utilities.stringFormat(calculation, _.rest(arguments), '%d')
      unit = calculation.match(unitsRegex)
      if(unit && _.without(unit, unit[0]).length > 0) return false
      calculation = calculation.replace(unitsRegex, '')
      return eval(calculation) + (unit ? unit[0] : 0 )
    }
  })
  return helpers
}