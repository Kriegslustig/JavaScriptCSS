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
          return [self.extendables[extendable].selectors].concat(self.extendables[extendable].selectors).join(', ') + ' {' + self.extendables[extendable].css + '}\n'
        }
      }
    }
  }
}