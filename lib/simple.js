const { buildRules } = require('./build-rules')
const defaultShorts = require('./shorts')
const flatStyles = require('./flat-styles')
const getCssRules = require('./get-css-rules')

class Simple {
   constructor(simples = [], shorts = {}) {
      if (!Array.isArray(simples)) throw new Error('simples parameter should be arrray')
      if (typeof shorts !== 'object') throw new Error('shorts parameter should be object')
      this.shorts = Object.assign({}, defaultShorts, shorts);
      this.styles = []
      this.selectors = []
      this.buildStyles(simples, this.styles)
   }

   buildStyles(simples, styles = []) {
      simples.forEach(obj => {
         if (typeof obj === 'string') return this.buildString(obj, styles)
         if (typeof obj !== 'object' || obj === null) return
         obj = flatStyles(obj)
         for (let selector in obj) {
            const rules = Array.isArray(obj[selector])
               ? this.buildStyles(obj[selector]) // @media/@keyframes/...
               : buildRules(obj[selector], this.shorts)
            const index = styles.findIndex(obj => obj[selector] !== undefined)
            if(index >= 0) styles[index][selector] = {...styles[index][selector],...rules} // group by selector
            else styles.push({ [selector]: rules }) 
         }
      });
      return styles
   }

   buildString(string, styles) {
      string = string.trim()
      if (string.startsWith('#')) string = '/*' + string.replace(/^\#/, '') + '*/' // It's a comment
      styles.push(string)
   }

   stylesheet(spaces) {
      const rules = (spaces && typeof spaces === 'number' && spaces > 0)
      ? getCssRules(this.styles,' '.repeat(spaces),'\n')
      : getCssRules(this.styles,'','')
      return rules.join('\n')
   }
}

module.exports = Simple