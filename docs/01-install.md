## Installation, Import, and Basic Usage

### Installation
To install `als-simple-css`, run the following command:
```bash
npm i als-simple-css
```

### Usage in Browser
Include the necessary scripts in your HTML file. Make sure to adjust the paths according to your project's structure.
```html
<!-- Optional: Include cssParser if you plan to use Simple.raw -->
<script src="/node_modules/als-css-parse/css-parser.js"></script>

<!-- Optional: Include ColorTools if you plan to use Simple.ColorTools or ColorTools -->
<script src="/node_modules/als-color-tools/color-tools.js"></script>

<script src="/node_modules/als-simple-css/simple.js"></script>
```

### Usage as CommonJS Module
For Node.js applications or when using a bundler that supports CommonJS:
```js
const Simple = require('als-simple-css');
```

### Usage as ES Module
For modern JavaScript projects that support ES Modules:
```js
import Simple from 'als-simple-css/simple.mjs';
```
