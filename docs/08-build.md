## Build and Watch with NodeJs

The folowing example will create css file:

build.js
```js
const Simple = require('als-simple-css')
const styles = require('./styles.js')
const css = Simple.raw(styles).stylesheet(3)
require('fs').writeFileSync('./styles.css',css,'utf-8')
```

You can watch for changes with Node watcher (Node v18.11 and higher):
```bash
node --watch build.js
```