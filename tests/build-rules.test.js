const { camelCase, buildRules, buildPropValue, getVars, buildCalc } = require('../lib/build-rules')
const assert = require('node:assert')
const { describe, it } = require('node:test')

describe('camelCase tests', () => {
	it('camelCase should correctly convert camelCase to kebab-case', () => {
		const propName = 'backgroundColor';
		const expected = 'background-color';
		assert(camelCase(propName) === expected);
	});

	it('converts multiple consecutive uppercase letters', () => {
      assert.strictEqual(camelCase('CSSProperty'), 'C-s-s-property');
   });

   it('converts all uppercase property', () => {
      assert.strictEqual(camelCase('URL'), 'U-r-l');
   });
})

describe('getVars tests', () => {
	it('complicated test', () => {
		const result = getVars(buildCalc('black [$test($some)*.5rem -2+$some] black solid'))
		const expected = 'black calc(var(--test,var(--some)) * .5rem - 2 + var(--some)) black solid'
		assert(result === expected)
	})

	it('handles multiple nested variables', () => {
      const result = getVars('var(--main-color, $secondaryColor)');
      const expected = 'var(--main-color, var(--secondary-color))';
      assert.strictEqual(result, expected);
   });

})

describe('buildCalc tests', () => {
	it('should convert simple calculation', () => {
		const calcString = '[$width + 10]';
		const expected = 'calc($width + 10)';
		assert.strictEqual(buildCalc(calcString), expected);
	});

	it('should handle complex calculations', () => {
		const calcString = '[$height - 20px * 2 / $ratio]';
		const expected = 'calc($height - 20px * 2 / $ratio)';
		assert.strictEqual(buildCalc(calcString), expected);
	});

	it('should properly space operators', () => {
		const calcString = '[$width-10+$height*2]';
		const expected = 'calc($width - 10 + $height * 2)';
		assert.strictEqual(buildCalc(calcString), expected);
	});
	
   it('handles different types of brackets', () => {
      const result = buildCalc('[$width + (100px - 20px)]');
      const expected = 'calc($width + (100px - 20px))';
      assert.strictEqual(result, expected);
   });

   it('handles calc with var', () => {
      const result = buildCalc('[$width + (var(--some) - 20px)]');
      const expected = 'calc($width + (var(--some) - 20px))';
      assert.strictEqual(result, expected);
   });
})

describe('buildPropValue tests', () => {

	it('should handle string values with quotes', () => {
		const propValue = '"Open Sans", sans-serif';
		const expected = '"Open Sans", sans-serif';
		assert.strictEqual(buildPropValue(propValue), expected);
	});

	it('should process complex values with variables and calc', () => {
		const propValue = '[$space*2] solid black';
		const expected = 'calc(var(--space) * 2) solid black';
		assert.strictEqual(buildPropValue(propValue), expected);
	});

	it('handles !important correctly', () => {
		const propValue = '10px !';
		const expected = '10px !important';
		assert.strictEqual(buildPropValue(propValue), expected);
	});

	it('handles multiple significant spaces', () => {
      const result = buildPropValue('  Open  Sans  ');
      const expected = 'Open  Sans';
      assert.strictEqual(result, expected);
   });

	// it('camelCase',() => {
	// 	const result = buildPropValue('linearGradient(90deg,black,white)')
	// 	assert(result === 'linear-gradient(90deg,black,white)')
	// })

	// it('should add px to numeric values', () => {
	// 	const propValue = 20;
	// 	const expected = '20px';
	// 	assert.strictEqual(buildPropValue(propValue), expected);
	// });

})

describe('buildRules integration tests', () => {
	// it('simple rules test', () => {
	// 	const rules = { 'font-size': 16 }
	// 	const shorts = {}
	// 	const expected = { 'font-size': '16px' }
	// 	assert.deepStrictEqual(buildRules(rules, shorts), expected)
	// })

	it('complex rules test', () => {
		const rules = { 'padding': '[$space*2] !' }
		const shorts = { 'padding': 'p' }
		const expected = { 'p': 'calc(var(--space) * 2) !important' }
		assert.deepStrictEqual(buildRules(rules, shorts), expected)
	})

	it('handles multiple properties', () => {
      const rules = { 'font-size': '16px', 'margin': '[$space]' };
      const shorts = {};
      const expected = { 'font-size': '16px', 'margin': 'calc(var(--space))' };
      assert.deepStrictEqual(buildRules(rules, shorts), expected);
   });

   it('handles unusual property names', () => {
      const rules = { 'X-Custom-Property': 'value' };
      const shorts = {};
      const expected = { 'X-Custom-Property': 'value' };
      assert.deepStrictEqual(buildRules(rules, shorts), expected);
   });
})
