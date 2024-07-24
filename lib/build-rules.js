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

module.exports = { camelCase, buildRules, buildPropValue, getVars, buildCalc }