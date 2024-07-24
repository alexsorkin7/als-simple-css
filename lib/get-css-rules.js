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
module.exports = getCssRules