const { execSync } = require('child_process');
let [,, path] = process.argv;

execSync(`node --test ./tests/${path}.test.js`, { stdio: 'inherit' });
