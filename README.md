# als-simple-css
Simple CSS is a powerful JavaScript library that allows developers to construct and manage CSS stylesheets dynamically with JS.

**Features**:
* JavaScript-Powered: With Simple CSS, your stylesheet is a JavaScript object. You get all the power of JavaScript - variables, loops, conditionals - to use in your styles.
* Dynamic Stylesheet Management: Simple CSS allows you to add, modify, and manipulate your styles at runtime, creating interactive and responsive stylesheets.
* Shortcuts for Common Styles: Shortcuts for frequent CSS properties are readily available in Simple CSS, making your style definitions compact and easy to read.
* Automated Conversion: The library automatically converts JavaScript style definitions to CSS, handling even tricky parts like camelCase to kebab-case conversion, and much more.
* Lightweight: Simple CSS is lightweight and has no dependencies, making it an easy addition to any project.



## Install, import and basic usage

For instalation:
```bash
npm i als-simple-css
```

Use in browser:
```html
<script src="/node_modules/als-simple-css/simple.js"></script>
```

Use as commonjs:
```js
const Simple = require('als-simple-css')
```

Use as module:
```js
import Simple from 'als-simple-css/simple.mjs'
```


## Syntax Overview
The Simple class in the Simple CSS library works with an array of style objects. Each object represents a CSS rule set/s, media query, or keyframe definition.

Let's break down how to define styles using Simple CSS:

### Basic Selectors
You start by defining a JavaScript object where the key is the CSS selector and the value is another object representing properties and their values. Here is the template for a basic selector:

```js
const simple = new Simple([
  {selector1: {
    'another-property': 'another-value'
    propertyName: 'property-value',
    selector2: {
      propertyName: 'property-value',
    },
  }},
  {selector1: {
    propertyName: 'property-value',
  }},
])
```


You can use camelCase property name (like it works in element.style) in addition to kebab-case. Like `borderWidth` instead `border-width`, `propertyValue` instead `property-value`.

Example:

```js
const simple = new Simple([
  {body: {
    backgroundColor: 'black',
    color: 'white',
    marginRight:'10px',
  }}
])
```


### @At rules

Each @at rule set, has to be in separated object. 

**Wrong**:
```js
[
   { 
      '@media query': [ /* array of style objects */ ],
      div:{/* styles */}
   }
]
```

**Right**:
```js
[
   { 
      '@media query': [ /* array of style objects */ ],
   },
   {
      div:{/* styles */}
   }
]
```


#### Media Queries
To define a media query, you use a key-value pair where the key is the full media query string and the value is an array of style objects that should apply under that media query. The format is as follows:

```js
{ '@media query': [ /* array of style objects */ ] }
```

Example:
```js
{
  '@media (max-width:800px)': [
    {
      '.some': {
        'font-size': '14px',
        'line-height': '1.5'
      }
    }
  ]
}
```

#### Keyframes

Similar to media queries, keyframes are represented as a key-value pair, where the key is @keyframes animationName and the value is an array of style objects representing the keyframe selectors (like '0%', '100%') and their corresponding style rules:

```js
{
  '@keyframes animationName': [
    {
      '0%': {
        /* styles */
      },
      '100%': {
        /* styles */
      }
    }
  ]
}
```

Example:

```js
{
  '@keyframes slide': [
    {
      '0%': {
        'transform': 'translateX(0)'
      },
      '100%': {
        'transform': 'translateX(100px)'
      }
    }
  ]
}
```


### Publish tools

Once you have defined your styles, you create a new instance of the Simple class and pass the styles array to the constructor. After that, you can either publish the styles to the browser using the publish() method, or retrieve the raw stylesheet using the stylesheet() method.

Example:

```js
const styles = [ /* your styles here */ ];

const simple = new Simple(styles);

// Publish the styles to the browser:
simple.publish();

// Or retrieve the raw stylesheet:
const rawStyles = simple.stylesheet(spaces);
```

If `spaces` is undefined, you getting minified version. Otherwise it formated by spaces parameter wich is number of spaces. 

## Property Shortcuts
In addition to the main syntax, the Simple class also provides an extensive list of property shortcuts. These are shortened representations of common CSS properties, designed to make your styles more concise and easier to write. 

For example, instead of writing 'background-color': 'red', you can use the bgc shortcut:
```js
{
  body: {
    bgc: 'red'
  }
}
```

Below are all the available shortcuts and their corresponding CSS properties:
| Shortcut | CSS Property |
|----------|--------------|
| a | animation |
| bgc | background-color |
| c | color |
| bg | background |
| bgi | background-image |
| b | border |
| br | border-right |
| bl | border-left |
| bt | border-top |
| bb | border-bottom |
| bc | border-color |
| brc | border-right-color |
| blc | border-left-color |
| btc | border-top-color |
| bbc | border-bottom-color |
| bs | border-style |
| brs | border-right-style |
| bls | border-left-style |
| bts | border-top-style |
| bbs | border-bottom-style |
| bw | border-width |
| brw | border-right-width |
| blw | border-left-width |
| btw | border-top-width |
| bbw | border-bottom-width |
| radius | border-radius |
| o | outline |
| oc | outline-color |
| os | outline-style |
| ow | outline-width |
| maxw | max-width |
| minw | min-width |
| h | height |
| w | width |
| maxh | max-height |
| minh | min-height |
| of | overflow |
| ofx | overflow-x |
| ofy | overflow-y |
| scrollb | scroll-behavior |
| p | padding |
| m | margin |
| pr | padding-right |
| pl | padding-left |
| pt | padding-top |
| pb | padding-bottom |
| mr | margin-right |
| ml | margin-left |
| mt | margin-top |
| mb | margin-bottom |
| d | display |
| flexw | flex-wrap |
| flexg | flex-grow |
| flexdir | flex-direction |
| ai | align-items |
| ac | align-content |
| jc | justify-content |
| gcols | grid-template-columns |
| grows | grid-template-rows |
| gacols | grid-auto-columns |
| garows | grid-auto-rows |
| areas | grid-template-areas |
| area | grid-area |
| dir | direction |
| textt | text-transform |
| ta | text-align |
| td | text-decoration |
| ws | white-space |
| ww | word-wrap |
| ff | font-family |
| to | text-overflow |
| ls | letter-spacing |
| lh | line-height |
| wb | word-break |
| fv | font-variant |
| fs | font-size |
| fw | font-weight |
| fstyle | font-style |
| f | font |
| pos | position |
| z | z-index |
| tr | transform |
| cur | cursor |


### Adding custom shortcuts

You can easily add your own shortcuts, by adding second parameter to constructor. 

Here is the example:

```js
const shorts = {
   aic:'animation-iteration-count',
   atf:'animation-timing-function'
}
const styles = [
   {'.some':{
      aic:'3',atf:'linear'
   }}
]
const simple = new Simple(styles,shorts)
console.log(simple.stylesheet())
```

The output:
```css
.some {
   animation-iteration-count:3;
   animation-timing-function:linear
}
```


## Variables
You can use css variables as is or to use shorter syntax as shown below:
* `{$varname:'value'}` equivalent to --varname:value
* `$varname(value)` equivalent to var(--varname,value)
* `$varname` equivalent to var(--varname)

Example:
```javascript
let styles = [
   {":root":{$w:'50px'}}, // --w:50px
   {".some": {width:'$w'}}, // width:var(--w)
   {".some1": {height:'$h(50px)'}} // height:var(--h,50px)
   {".nested": {height:'$some($w)'}} // height:var(--some,var(--w))
]
```

## Calc syntax

You can use css calc function in regular way, like:

```js
[
   {'.some':{
      m:'calc(1rem / 2)',
      b:'calc(var(--space) * 2) solid black'
   }}
]
```

Or in short way, like this:
```js
[
   {'.some':{
      m:'[1rem/2]',
      b:'[$space*2] solid black'
   }}
]
```

The spaces around operation sign added automatically. 

## !important
By using ``!`` in property's value, you add ``!important``. 

For example:
```javascript
let styles = [
   {'.test':{color:'red'}},
   {'.test':{color:'green !'}}, // color: green !important
]
```

## Comments and Charset Declarations

With Simple CSS, you can insert comments or any other string such as charset declarations into your styles array. These are inserted as separate string items in the array.

For instance, if you want to add a comment, you can include it as a string in the styles array, like this:

```js
const styles = new Simple([
   {'.test':{c:'red'}},
   '# comment ', // /* comment */
   {'.test2':{c:'green'}},
])
```

Similarly, you can add a charset declaration to the stylesheet. For example, if you want to specify UTF-8 as the charset, you can do so as follows:

```js
const styles = new Simple([
   '@charset "UTF-8";',
   {'.test':{c:'red'}},
   {'.test2':{c:'green'}},
])
```




## Nested styles

You can use nested styles like this:
```js
const simple = new Simple([{
   'div': { 
      color: 'blue',
      ':hover': { color: 'red' },
      ':focus': { color: 'green' },
   },
}]).stylesheet('  ')
```

The result:
```css
div {
   color:blue
}
div:hover {
   color:red
}
div:focus {
   color:green
}
```
## Variable Management

You can manage global css variables with `Simple.$(varName,varValue,varValue2)` method. Here how it works:

```javascript
Simple.$('w') // return 50px
Simple.$('w','100px') // Changing --w to 100px
Simple.$('w','100px','50px') // if w=50px, change to 100px. If w=100px, change to 50px. Else - do nothing. 
```

Here is the example of usage:

```html
<script>
new Simple([
   {":root": {$d:'none'}},
   {".block": {d:'$d'}},
])
</script>

<button onclick="Simple.$('d','none','block')">Hide/show</button>
<div class="block">Hello</div>
```


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