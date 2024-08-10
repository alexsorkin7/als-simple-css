const { describe, it } = require('node:test')
const assert = require('node:assert')
const Simple = require('../lib/simple')

describe('Constructor tests', () => {
	it('constructor should correctly initialize styles and shorts', () => {
		const initialStyles = [{'div':{ color: 'red' }}];
		const initialShorts = { c: 'color' };

		const simple = new Simple(initialStyles, initialShorts);
		assert.deepStrictEqual(simple.styles,initialStyles);
	});

	it('constructor should throw an error for invalid styles input', () => {
		const invalidStyles = 'not-an-array';
		assert.throws(() => new Simple(invalidStyles));
	});

})

describe('Simple methods tests', () => {
	it('convertStylesToCSS should correctly convert styles to CSS', () => {
		const styles = [{ body: { color: 'red' } }]
		const simple = new Simple(styles)
		assert.deepStrictEqual(simple.styles,styles);
	});

	it('getVars should correctly handle CSS variable substitution', () => {
		const simple = new Simple([{
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
		assert.deepStrictEqual(simple.styles,expected)
	});

	it('getRules should correctly form CSS rules', () => {
		const simple = new Simple([{ body: { color: 'red' } }])
		const stylesheet = simple.stylesheet()
		assert(stylesheet.includes('body {'))
		assert(stylesheet.includes('color:red'))
	});

	it('Comments', () => {
		const simple = new Simple(['# Some comment',{ body: { color: 'red' } }])
		const stylesheet = simple.stylesheet()
		assert(stylesheet.includes('/* Some comment'))
	});
})

describe('Edge tests', () => {
	it('should correctly handle complex CSS rules', () => {
		const complexStyles = [{
			"@media screen and (min-width: 600px)": [{
				body: { "background-color": "lightblue" },
				'.some': { color: 'green' }
			}],
			"h1, h2": { "color": "red" }
		}];
		const simple = new Simple(complexStyles);
		const stylesheet = simple.stylesheet();
		assert(stylesheet.includes("@media screen and (min-width: 600px) {"));
		assert(stylesheet.includes("h1, h2 {"));
		assert(stylesheet.includes("background-color:lightblue"));
		assert(stylesheet.includes("color:red"));
	});

	it('should correctly handle pseudo-classes and pseudo-elements', () => {
		const stylesWithPseudo = [{
			"a:hover": { "color": "green" },
			"p::first-line": { "color": "blue" }
		}];
		const simple = new Simple(stylesWithPseudo);
		const stylesheet = simple.stylesheet();
		assert(stylesheet.includes("a:hover {"));
		assert(stylesheet.includes("p::first-line {"));
		assert(stylesheet.includes("color:green"));
		assert(stylesheet.includes("color:blue"));
	});

	it('should correctly handle CSS variables substitution', () => {
		const stylesWithVars = [{
			":root": { "--main-color": "blue" },
			"div": { "color": "var(--main-color)" }
		}];
		const simple = new Simple(stylesWithVars);
		const stylesheet = simple.stylesheet();
		assert(stylesheet.includes(":root {"));
		assert(stylesheet.includes("--main-color:blue"));
		assert(stylesheet.includes("div {"));
		assert(stylesheet.includes("color:var(--main-color)"));
	});

	it('should correctly handle complex scenarios with shorts and variables', () => {
		const complexStyles = [{
			"div": { "m": "$space", "p": "10px" },
			":root": { "$space": "20px" }
		}];
		const simple = new Simple(complexStyles);
		const stylesheet = simple.stylesheet();
		assert(stylesheet.includes("div {"));
		assert(stylesheet.includes("margin:var(--space)"));
		assert(stylesheet.includes("padding:10px"));
		assert(stylesheet.includes(":root {"));
		assert(stylesheet.includes("--space:20px"));
	});

	it('nested styles', () => {
		const simple = new Simple([{
			'div': { 
				color: 'blue',
				':hover': { color: 'red' },
				':focus': { color: 'green' },
			},
		}])
		const css = simple.stylesheet()
		assert(css.includes('div {'))
		assert(css.includes('div:hover {'))
		assert(css.includes('div:focus {'))
	})
})

describe('Complex tests', () => {
	it('should handle CSS variables with nested selectors', () => {
		const styles = [{
			':root': { '--main-color': 'black' },
			'div': { 
				'color': 'var(--main-color)',
				' span': { 'color': 'var(--main-color)' }
			},
		}];
		const simple = new Simple(styles);
		const stylesheet = simple.stylesheet();
		assert(stylesheet.includes(':root {'));
		assert(stylesheet.includes('--main-color:black'));
		assert(stylesheet.includes('div {'));
		assert(stylesheet.includes('color:var(--main-color)'));
		assert(stylesheet.includes('div span {'));
		assert(stylesheet.includes('color:var(--main-color)'));
	});

	it('should correctly override styles', () => {
		const styles = [{
			'div': { 'color': 'blue', 'background': 'red' },
			' div': { 'color': 'green' } // Переопределение цвета
		}];
		const simple = new Simple(styles);
		const stylesheet = simple.stylesheet();
		assert(stylesheet.includes('div {'));
		assert(stylesheet.includes('color:green')); // Проверка переопределенного цвета
		assert(stylesheet.includes('background:red')); // Проверка сохранения фона
	});

})

describe('raw method tests', () => {
	it('Simple test', () => {
		const {styles} = Simple.raw(`body {
			bgc:blue;
		}`)
		assert(JSON.stringify(styles) === '[{"body":{"background-color":"blue"}}]')
	})
})