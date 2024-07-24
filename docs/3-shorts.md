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

