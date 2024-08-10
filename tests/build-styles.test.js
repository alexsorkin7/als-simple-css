const { describe, it } = require('node:test')
const assert = require('node:assert')
const buildStyles = require('../lib/build-styles')

describe('buildStyles tests', () => {
	it('convertStylesToCSS should correctly convert styles to CSS', () => {
		const styles = [{ body: { color: 'red' } }]
		assert.deepStrictEqual(buildStyles(styles),styles);
	});

	it('getVars should correctly handle CSS variable substitution', () => {
		const styles = buildStyles([{
			':root': { $someTest: '5px' },
			div: {
				border: `$someTest solid $color(black)`,
				margin: `$m($someTest)`
			}
		}])
		const expected = [
			{
				":root": {
					"--some-test": "5px"
				}
			},
			{
				"div": {
					"border": "var(--some-test) solid var(--color,black)",
					"margin": "var(--m,var(--some-test))"
				}
			}
		]
		assert.deepStrictEqual(styles,expected)
	});

})
