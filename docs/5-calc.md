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
