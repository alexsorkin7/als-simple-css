const { readFileSync, writeFileSync, watch, existsSync } = require('fs')
const { join } = require('path')

const dir = join(__dirname, '..', 'lib')
const files = [
   'shorts',
   'flat-styles',
   'build-rules',
   'build-styles',
   'get-css-rules',
   'simple'
]

function browserVersion(content) {
   const addons = [
      readFileSync(join(dir, 'front', 'publish.js'), 'utf-8'),
      readFileSync(join(dir, 'front', '$.js'), 'utf-8')
   ]
   content = addons.join('\n') + content
   content = content.slice(0, -1)
   content += `
   publish() {
      publishRules(getCssRules(this.styles,'',''))
   }
}
Simple.$ = $
`
   return `const Simple = (function() {
${content}
return Simple
})()`
}

function esmVersion(content) {
   let nodeModulesPath = join(__dirname,'..','node_modules')
   if(!existsSync(nodeModulesPath)) {
      if(existsSync(join(__dirname,'..','..'))) nodeModulesPath = join(__dirname,'..','..')
      else if(nodeModulesPath === undefined) throw 'Please install dependencies'
   }
   const cssparser = readFileSync(join(nodeModulesPath,'als-css-parse','css-parser.js'),'utf-8')
   const colorTools = readFileSync(join(nodeModulesPath,'als-color-tools','color-tools.js'),'utf-8')
   .replace('try { module.exports = ColorTools } catch (error) { }','')
   return [
      cssparser,
      colorTools,
      content,
      'Simple.ColorTools = ColorTools;',
      'export default Simple',
   ].join('\n')
}

function write() {
   let content = files.map(name => readFileSync(join(dir, name + '.js'), 'utf-8')).join('\n');
   content = content.replace(/const .*\s=\srequire.*$/gm, '')
   content = content.replace(/module\.exports.*$/gm, '')
   content = content.replace(/(^\s$){2}/gm, '')
   content = content.trim()

   writeFileSync(join(__dirname, '..', 'simple.js'), browserVersion(content))
   writeFileSync(join(__dirname, '..', 'simple.mjs'), esmVersion(content))
}

write()
if (process.argv[2] === '--watch') {
   console.log('wathing..')
   let i = 0
   let last = Date.now()
   watch(dir, () => {
      const now = Date.now()
      if (now - last < 50) return
      write()
      console.log(`Builded (${i++})`)
      last = now
   })
}
