const Simple = (function() {
let stylesheet
function publishRules(rules) {
   if(!stylesheet) {
      if (document.styleSheets.length == 0) {
         let head = document.getElementsByTagName('head')[0]
         head.insertAdjacentHTML('afterbegin', '<style id="simple-css"></style>')
      }
      stylesheet = document.styleSheets[0]
   }
   rules.filter(rule => !(rule.startsWith('/*')))
   .forEach(rule => {
      try {stylesheet.insertRule(rule)} 
      catch (error) {console.log(error.message)}
   })
}
function $(varName, varVal, varVal2) {
   const docEl = document.documentElement
   if (varVal == undefined) return getComputedStyle(docEl).getPropertyValue('--' + varName)
   else if (varVal2 === undefined) docEl.style.setProperty('--' + varName, varVal)
   else if (varVal2 !== undefined) {
      let curVal = getComputedStyle(docEl).getPropertyValue('--' + varName)
      if (curVal == varVal) docEl.style.setProperty('--' + varName, varVal2)
      else if (curVal == varVal2) docEl.style.setProperty('--' + varName, varVal)
   }
   return varVal
}
const defaultShorts = {
   a: 'animation',
   bgc: 'background-color',
   c: 'color',
   bg: 'background',
   bgi: 'background-image',
   b: 'border',
   br: 'border-right',
   bl: 'border-left',
   bt: 'border-top',
   bb: 'border-bottom',
   bc: 'border-color',
   brc: 'border-right-color',
   blc: 'border-left-color',
   btc: 'border-top-color',
   bbc: 'border-bottom-color',
   bs: 'border-style',
   brs: 'border-right-style',
   bls: 'border-left-style',
   bts: 'border-top-style',
   bbs: 'border-bottom-style',
   bw: 'border-width',
   brw: 'border-right-width',
   blw: 'border-left-width',
   btw: 'border-top-width',
   bbw: 'border-bottom-width',
   radius: 'border-radius',
   o: 'outline',
   oc: 'outline-color',
   os: 'outline-style',
   ow: 'outline-width',
   maxw: 'max-width',
   minw: 'min-width',
   h: 'height',
   w: 'width',
   maxh: 'max-height',
   minh: 'min-height',
   of: 'overflow',
   ofx: 'overflow-x',
   ofy: 'overflow-y',
   scrollb: 'scroll-behavior',
   p: 'padding',
   m: 'margin',
   pr: 'padding-right',
   pl: 'padding-left',
   pt: 'padding-top',
   pb: 'padding-bottom',
   mr: 'margin-right',
   ml: 'margin-left',
   mt: 'margin-top',
   mb: 'margin-bottom',
   d: 'display',
   flexw: 'flex-wrap',
   flexg: 'flex-grow',
   flexdir: 'flex-direction',
   ai: 'align-items',
   ac: 'aline-content',
   jc: 'justify-content',
   gcols: 'grid-template-columns',
   grows: 'grid-template-rows',
   gacols: 'grid-auto-columns',
   garows: 'grid-auto-rows',
   areas: 'grid-template-areas',
   area: 'grid-area',
   dir: 'direction',
   textt: 'text-transform',
   ta: 'text-align',
   td: 'text-decoration',
   ws: 'white-space',
   ww: 'word-wrap',
   ff: 'font-family',
   to: 'text-overflow',
   ls: 'letter-spacing',
   lh: 'line-height',
   wb: 'word-break',
   fv: 'font-variant',
   fs: 'font-size',
   fw: 'font-weight',
   fstyle: 'font-style',
   f: 'font',
   pos: 'position',
   z: 'z-index',
   tr: 'transform',
   cur: 'cursor'
}

function flatStyles(styles,newStyles = {}) {
   for(let selector in styles) {
      const rules = styles[selector]
      if(Array.isArray(rules)) { // it's @media/@keyframes/...
         newStyles[selector] = rules
         continue
      }
      for(let prop in rules) {
         let value = rules[prop]
         if(typeof value === 'object') { // nested styles
            const nestedSelecor = prop.split(',').map(p => selector.trim().split(',').map(s => s+p).join()).join()
            flatStyles({[nestedSelecor]:value},newStyles)
         } else { // prop:value
            if(!newStyles[selector]) newStyles[selector] = {}
            newStyles[selector][prop] = value
         }
      }
   }
   return newStyles
}

function buildRules(rules, shorts, newRules = {}) {
   for (let propName in rules) {
      let propValue = buildPropValue(rules[propName])
      propName = shorts[propName] ? shorts[propName] : camelCase(propName)
      propName = propName.replace(/^\$/, '--')
      newRules[propName] = propValue
   }
   return newRules
}
function camelCase(v) {
   return v.split('').map((l,i) => {
      const last = v[i-1]
      if(i === 0 || last === ' ' || last == '-' || !(/[A-Z]/.test(l))) return l
      return '-'+l.toLowerCase()
   }).join('')
}
function buildCalc(propValue) {
   const operations = ['*', '-', '+', '/']
   return propValue.replace(/\[(.*?)\]/g, (match, calc) => {
      return 'calc(' + calc.split('').map((l, i) => {
         if (!operations.includes(l)) return l
         if(l === '-' && /[^\d\s]/.test(calc[i+1])) return l
         if (calc[i - 1] !== ' ') l = ' ' + l
         if (calc[i + 1] !== ' ') l = l + ' '
         return l
      }).join('') + ')'
   })
}
function getVars(values) {
   return values.replace(/\$([\w-$]*)(\(\$?([\w-()$]*)\))?/g, (match, name, value) => {
      value = value ? ',' + getVars(value.replace(/[()]/g, '')) : ''
      return `var(--${camelCase(name)}${value})`
   })
}
function buildPropValue(propValue) {
   propValue = propValue.toString().trim()
   if (/["'].*["']/.test(propValue)) return propValue
   propValue = buildCalc(propValue)
   propValue = getVars(propValue)
   propValue = propValue.replace(/\!/, '!important')
   return propValue
}

function getCssRules(styles, space = '   ', n = '\n', s = '') {
   return styles.map(obj => {
      if (typeof obj == 'string') return obj.trim()
      const [selector, props] = Object.entries(obj)[0]
      return Array.isArray(props)
         ? `${selector} {${n}${getCssRules(props, space + space, n, space).join(n)}${n}}`
         : `${s}${selector} {${n}${Object.entries(props).map(
            ([name, value]) => `${space}${name}:${value}`
         ).join(`;${n}`)}${n}${s}}`
   })
}
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

   publish() {
      publishRules(getCssRules(this.styles,'',''))
   }
}
Simple.$ = $

return Simple
})()