const { readdirSync, writeFileSync, readFileSync } = require('fs')
const { join } = require('path')

const root = join(__dirname,'..')
const content = readdirSync(join(root,'docs'),{withFileTypes:true}).map(({path,name}) => {
   if(!name.endsWith('.md')) return ''
   return readFileSync(join(path,name),'utf-8')
}).join('\n')

writeFileSync(join(root,'readme.md'),content,'utf-8')
