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



