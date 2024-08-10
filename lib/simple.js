const defaultShorts = require('./shorts')
const getCssRules = require('./get-css-rules')
const cssParser = require('als-css-parse')
const buildStyles = require('./build-styles')

class Simple {
   static shorts = defaultShorts
   static raw(content, comments = true) {
      if (typeof content !== 'string') throw 'rawSimple parameter has to be string'
      if (cssParser === undefined) throw 'cssParser not found.'
      return new Simple(cssParser(content, comments))
   }
   static styles(simples) { return new Simple(simples) }
   constructor(simples = []) {
      if (!Array.isArray(simples)) throw new Error('simples parameter should be arrray')
      this.styles = buildStyles(simples, [], Simple.shorts)
   }

   stylesheet(spaces, n = '\n') {
      const rules = (spaces && typeof spaces === 'number' && spaces > 0)
         ? getCssRules(this.styles, ' '.repeat(spaces), n)
         : getCssRules(this.styles, '', '')
      return rules.join(n)
   }
}

module.exports = Simple