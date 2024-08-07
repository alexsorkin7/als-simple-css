const cssParser = require('als-css-parse')
const Simple = require('als-simple-css')
const { writeFileSync } = require('fs')
const {join} = require('path')
function buildModule(src, dest, spaces = 3,comments=true) {
   const content = require(join(process.cwd(),src))
   const css = new Simple(cssParser(content,comments)).stylesheet(spaces)
   if (dest) writeFileSync(dest,css,'utf-8')
   return css
}

module.exports = buildModule