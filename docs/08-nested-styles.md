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