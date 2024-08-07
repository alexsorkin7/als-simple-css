const { readFileSync, writeFileSync, watch } = require('fs')
const { join } = require('path')

const dir = join(__dirname, '..', 'lib')
const files = [
   'shorts',
   'flat-styles',
   'build-rules',
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
   return content + `
export default Simple`
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
