const assert = require('node:assert')
const { describe, it } = require('node:test')
const flatStyles = require('../lib/flat-styles')

describe('flat styles', () => {
   it('basic test', () => {
      const sample = {
         'div,span': {
            d: 'block',
            '.some': {
               c: 'red',
               ':hover': { c: 'blue' },
               ':focus': { c: 'green' }
            },
         },
         '.anoter-class': {
            margin: '1rem',
         }
      }

      const expectedResult = {
         'div,span': { d: 'block' },
         'div.some,span.some': { c: 'red' },
         'div.some:hover,span.some:hover': { c: 'blue' },
         'div.some:focus,span.some:focus': { c: 'green' },
         '.anoter-class': { margin: '1rem' }
      }

      const result = flatStyles(sample)
      assert.deepStrictEqual(result, expectedResult)
   })

   it('handles empty styles object', () => {
      const sample = {}
      const expectedResult = {}
      const result = flatStyles(sample)
      assert.deepStrictEqual(result, expectedResult)
   })

   it('handles @media and @keyframes rules', () => {
      const sample = {
         '@media screen and (min-width: 600px)': [{
            'div': { 'font-size': '12px' }
         }],
         '@keyframes slide': [{
            'from': { 'top': '0px' },
            'to': { 'top': '100px' }
         }]
      }
      const expectedResult = {
         '@media screen and (min-width: 600px)': [{ 'div': { 'font-size': '12px' } }],
         '@keyframes slide': [{ 'from': { 'top': '0px' }, 'to': { 'top': '100px' } }]
      }
      const result = flatStyles(sample)
      assert.deepStrictEqual(result, expectedResult)
   })

   it('handles unusual properties', () => {
      const sample = {
         'div': {
            'content': '"✓"',
            ':after': {
               'content': '"✕"'
            }
         }
      }
      const expectedResult = {
         'div': { 'content': '"✓"' },
         'div:after': { 'content': '"✕"' }
      }
      const result = flatStyles(sample)
      assert.deepStrictEqual(result, expectedResult)
   })

   it('handles nested selectors', () => {
      const sample = {
         'ul': {
            ' li': {
               'color': 'red',
               ':hover': { 'color': 'blue' }
            }
         }
      }
      const expectedResult = {
         'ul li': { 'color': 'red' },
         'ul li:hover': { 'color': 'blue' }
      }
      const result = flatStyles(sample)
      assert.deepStrictEqual(result, expectedResult)
   })

   it('handles multiple nested rules in one selector', () => {
      const sample = {
         'div': {
            ':hover': { 'color': 'blue' },
            ':focus': { 'color': 'green' }
         }
      }
      const expectedResult = {
         'div:hover': { 'color': 'blue' },
         'div:focus': { 'color': 'green' }
      }
      const result = flatStyles(sample)
      assert.deepStrictEqual(result, expectedResult)
   })

   it('handles selectors with no rules', () => {
      const sample = {
         'div': {},
         'span': {
            'color': 'red'
         }
      }
      const expectedResult = {
         'span': { 'color': 'red' }
      }
      const result = flatStyles(sample)
      assert.deepStrictEqual(result, expectedResult)
   })

   it('handles deeply nested selectors', () => {
      const sample = {
         'div': {
            '.inner': {
               ' span': {
                  'color': 'red'
               }
            }
         }
      }
      const expectedResult = {
         'div.inner span': { 'color': 'red' }
      }
      const result = flatStyles(sample)
      assert.deepStrictEqual(result, expectedResult)
   })


})
