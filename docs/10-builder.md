## Builder

Now you can use builder (and watch with node tools) for converting js files to css code. 

User `Simple Css Syntax` plugin for VsCode to highlight the syntax. 

build.js
```js
const build = require('als-simple-css/build')
const spaces = 0; // 3 by default
const comments = false; // true by default
build('./src/styles.js','./dest/styles.css',spaces,comments)
```

```bash
node build
```

```bash
node --watch build
```


### Example

styles.js
```js
const colors = [
   ['red','red'],
   ['blue','blue'],
   ['green','green']
]

const styles = /*simple*/`
:root {
   ${colors.map(([name,color]) => `$${name}:${color}`).join(';')}
}
body {
   background-color:blue;
   & .test {
      background-color:red;
   }
}
.some {
   background:url('./image.jpg');
   &:hover {
      color:$blue;
   }
}

${colors.map(([name,color]) => {
   return /*scss*/`
   .btn-${name} {
      background-color:$${color};
      color:white;
      &:hover {
         background-color:inherit;
      }
   }
   `
}).join('\n')}
`

module.exports = styles
```

style.css (result)
```css
:root {
   --red:red;
   --blue:blue;
   --green:green
}
body {
   background-color:blue
}
body .test {
   background-color:red
}
.some {
   background:url('./image.jpg')
}
.some:hover {
   color:var(--blue)
}
.btn-red {
   background-color:var(--red);
   color:white
}
.btn-red:hover {
   background-color:inherit
}
.btn-blue {
   background-color:var(--blue);
   color:white
}
.btn-blue:hover {
   background-color:inherit
}
.btn-green {
   background-color:var(--green);
   color:white
}
.btn-green:hover {
   background-color:inherit
}
```