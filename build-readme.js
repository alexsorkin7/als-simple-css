const { readdirSync, writeFileSync, readFileSync } = require('fs')
const { join } = require('path')


const content = readdirSync('./docs',{withFileTypes:true}).map(({path,name}) => {
   return readFileSync(join(path,name),'utf-8')
}).join('\n')

writeFileSync('readme.md',content,'utf-8')
