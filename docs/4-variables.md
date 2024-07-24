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
