const { buildRules } = require('./build-rules')
const flatStyles = require('./flat-styles')
const defaultShorts = require('./shorts')
function buildString(string, styles) {
   string = string.trim()
   if (string.startsWith('#')) string = '/*' + string.replace(/^\#/, '') + '*/' // It's a comment
   styles.push(string)
}

function buildStyles(simples, styles = [], shorts = defaultShorts) {
   simples.forEach(obj => {
      if (typeof obj === 'string') return buildString(obj, styles,shorts)
      if (typeof obj !== 'object' || obj === null) return
      obj = flatStyles(obj)
      for (let selector in obj) {
         const rules = Array.isArray(obj[selector])
            ? buildStyles(obj[selector],[],shorts) // @media/@keyframes/...
            : buildRules(obj[selector], shorts)
         const index = styles.findIndex(obj => obj[selector] !== undefined)
         if(index >= 0) styles[index][selector] = {...styles[index][selector],...rules} // group by selector
         else styles.push({ [selector]: rules }) 
      }
   });
   return styles
}

module.exports = buildStyles