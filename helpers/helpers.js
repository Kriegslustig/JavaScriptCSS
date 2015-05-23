module.exports = function (context) {
  return {
    $: function (expression) {
      return expression
    },

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
        context.onDone.push(this.extendMaker(extendable))
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
    }
  }
}