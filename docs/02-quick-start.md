## Basic Usage

### Creating Styles
You can create styles using either structured JavaScript objects or raw CSS strings. The `Simple` class provides two static methods for these purposes: `Simple.styles()` for JavaScript objects and `Simple.raw()` for raw CSS strings.

#### Using Simple.styles
This method takes an array of style objects:
```js
const arr = [
    {'.selector': { color: 'red', margin: '10px' }}
]
const styles = Simple.styles(arr);
// or 
const styles = new Simple(arr);
console.log(styles.stylesheet());
```

#### Using Simple.raw
This method parses a raw CSS string:
```js
const rawStyles = Simple.raw(`
.selector {
    color: red;
    margin: 10px;
}
`);
console.log(rawStyles.stylesheet());
```

>Tip: Use `Simple Css Syntax` plugin for VsCode to highlight the raw syntax. 

The result:
```css
.selector {color:red;margin:10px}
```

The `stylesheet` method has 2 parameters:
1. `spaces` (0 by default) - use for formating code by spaces
2. `n` ('\n' by default) - use for new line formating

The result for `stylesheet(3)`:
```css
.selector {
   color:red;
   margin:10px
}
```