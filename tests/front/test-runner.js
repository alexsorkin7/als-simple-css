const body = document.querySelector('body')
const stack = []
const onlyStack = []
async function runTests() {
   const stackForRun = onlyStack.length ? onlyStack : stack
   for(const {title,fn} of stackForRun) {
      body.insertAdjacentHTML('beforeEnd',
      /*html*/`<div style="font-weight:bold; color:blue; margin-top:1rem;">${title}</div>`)
      try {
         await fn()
      } catch (error) {
         body.insertAdjacentHTML('beforeEnd',/*html*/`<div>${error.message}</div>`)
         console.log(error)
      }
   }
}

function assert(expression, title = 'Fail') {
   const space = '&nbsp;'.repeat(3)
   if(expression) body.insertAdjacentHTML('beforeend',/*html*/`<div style="color:green">${space}Success</div>`)
   else body.insertAdjacentHTML('beforeend',/*html*/`<div style="color:red">${space}Fail:${title}</div>`)
}

assert.deepStrictEqual = function(obj1, obj2, message) {
   function check(obj1,obj2,visited = new WeakMap()) {
      if (obj1 === obj2) return true;
   
      if (visited.has(obj1) && visited.get(obj1) === obj2) return true;
   
      const type1 = typeof obj1;
      const type2 = typeof obj2;
      if (type1 !== type2 || type1 !== 'object' || obj1 === null || obj2 === null) return false;
      visited.set(obj1, obj2);
   
      const keys1 = Object.keys(obj1);
      const keys2 = Object.keys(obj2);
      if (keys1.length !== keys2.length) return false;
   
      for (let key of keys1) {
         if (!keys2.includes(key) || !check(obj1[key], obj2[key], visited)) return false;
      }
      return true;
   }
   assert(check(obj1,obj2),message)
};

function it(title, fn) {
   stack.push({title,fn})
}

it.skip = function () { }
it.only = function (title,fn) {onlyStack.push({title,fn})}
