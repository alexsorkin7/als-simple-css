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
            prop.split(',').forEach(propname => newStyles[selector][propname] = value)
         }
      }
   }
   return newStyles
}

module.exports = flatStyles