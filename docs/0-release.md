# Release notes for als-simple-css 9

* ColorTools class - separted package `als-color-tools`
* Improved code (builded from scratch)
* `#` syntax for comments
* few selectors in objects [{selector:{},selector1:{}},'# some comment']
* nested styles support
* short syntax for calc ([calc])
* nested variables ($var($anotherVar))
* Node version and browser versions are different

## 9.1 release

* Few short calc syntax `[]` in one property issue solved
   * `.some:{padding:'[$p/3] [$p/2]'}`
* Variables with dash inside calc - solved
  * `{padding:'[$p-some/3]'}`
* Nested selector with multimple selectors - solved (see example below)
```js
new Simple([
   {'.btn-shaded':{
      bgc:'blue',c:`white`,
      ':not(:disabled)':{
         ':hover,:focus':{
            bgc:'lightblue',c:'darkblue'
         },
      }
   }},
])
```
