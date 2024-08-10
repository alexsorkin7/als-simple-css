## Publish tools

Once you have defined your styles, you create a new instance of the Simple class and pass the styles array to the constructor. After that, you can either publish the styles to the browser using the publish() method, or retrieve the raw stylesheet using the stylesheet() method.

> This method available only in browser's version

Example:

```js
const styles = [ /* your styles here */ ];

const simple = new Simple(styles);

// Publish the styles to the browser:
simple.publish();

// Or retrieve the raw stylesheet:
const rawStyles = simple.stylesheet(spaces,n);
```

If `spaces` is undefined, you getting minified version. Otherwise it formated by spaces parameter wich is number of spaces. 
The `n` parameter is a line separator. By default it's `\n`.
