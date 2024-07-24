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
