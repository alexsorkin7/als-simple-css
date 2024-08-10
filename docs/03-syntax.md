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

### Variables
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

### Calc syntax

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

### !important
By using ``!`` in property's value, you add ``!important``. 

For example:
```javascript
let styles = [
   {'.test':{color:'red'}},
   {'.test':{color:'green !'}}, // color: green !important
]
```

### Comments and Charset Declarations

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

### Nested styles

You can use nested styles like this:
```js
const simple = new Simple([{
   'div': { 
      color: 'blue',
      ':hover': { color: 'red' },
      ':focus': { color: 'green' },
   },
}]).stylesheet(3)
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