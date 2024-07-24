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
