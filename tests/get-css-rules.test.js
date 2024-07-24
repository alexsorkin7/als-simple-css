const getCssRules = require('../lib/get-css-rules')
const assert = require('node:assert')
const { describe, it } = require('node:test')

describe('Basic tests', () => {

   it('large css', () => {

      const styles = [
         { div: { display: 'block' } },
         { 'div.some': { color: 'red' } },
         { 'div.some:hover': { color: 'blue' } },
         { 'div.some:focus': { color: 'green' } },
         '/* comment*/',
         { body: { margin: '10px' } },
         {
            '@media': [
               {
                  body: {
                     'background-color': 'pink',
                     'margin': '1rem'
                  }
               }
            ]
         }
      ]

      const expected = [
         'div {\n   display:block\n}',
         'div.some {\n   color:red\n}',
         'div.some:hover {\n   color:blue\n}',
         'div.some:focus {\n   color:green\n}',
         '/* comment*/',
         'body {\n   margin:10px\n}',
         '@media {\n   body {\n      background-color:pink;\n      margin:1rem\n   }\n}'
      ]
      const result = getCssRules(styles)
      assert.deepStrictEqual(result, expected)
   })

   it('handles empty styles array', () => {
      const styles = []
      const expectedResult = []
      const result = getCssRules(styles)
      assert.deepStrictEqual(result, expectedResult)
   })

   it('handles nested @media and @keyframes rules', () => {
      const styles = [
         {
            '@media screen and (min-width: 600px)': [
               { 'div': { 'font-size': '12px' } }
            ]
         },
         {
            '@keyframes slide': [
               { 'from': { 'top': '0px' } },
               { 'to': { 'top': '100px' } }
            ],
         },
         {'@keyframes test': [
            { '0%': { 'top': '0px' } },
            { '100%': { 'top': '100px' } }
         ]}
      ]
      const expectedResult = [
         '@media screen and (min-width: 600px) {\n   div {\n      font-size:12px\n   }\n}',
         '@keyframes slide {\n   from {\n      top:0px\n   }\n   to {\n      top:100px\n   }\n}',
         '@keyframes test {\n   0% {\n      top:0px\n   }\n   100% {\n      top:100px\n   }\n}'
      ]
      const result = getCssRules(styles)
      assert.deepStrictEqual(result, expectedResult)
   })

   it('handles incorrect data types', () => {
      const styles = [123, { 'div': { 'color': 'blue' } }]
      assert.throws(() => getCssRules(styles), Error)
   })

   it('handles pseudo-classes and pseudo-elements', () => {
      const styles = [
         { 'a:hover': { color: 'blue' } },
         { 'p::before': { content: '"Hello"' } }
      ]
      const expectedResult = [
         'a:hover {\n   color:blue\n}',
         'p::before {\n   content:"Hello"\n}'
      ]
      const result = getCssRules(styles)
      assert.deepStrictEqual(result, expectedResult)
   })

   it('handles various property value types', () => {
      const styles = [
         { 'h1': { 'margin': '10px 20px' } },
         { 'h2': { 'font-weight': 700 } }
      ]
      const expectedResult = [
         'h1 {\n   margin:10px 20px\n}',
         'h2 {\n   font-weight:700\n}'
      ]
      const result = getCssRules(styles)
      assert.deepStrictEqual(result, expectedResult)
   })

   it('handles rules without properties', () => {
      const styles = [
         { 'div': {} },
         { 'span': { 'color': 'black' } }
      ]
      const expectedResult = [
         'div {\n\n}',
         'span {\n   color:black\n}'
      ]
      const result = getCssRules(styles)
      assert.deepStrictEqual(result, expectedResult)
   })

})