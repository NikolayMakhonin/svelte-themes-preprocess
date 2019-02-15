import * as svelte from 'svelte'
import fs from 'fs'
import themePreprocess from '../../../../main/node/main'
import basePreprocess from 'svelte-preprocess'
import postcssImport from 'postcss-import'

describe('node > main > main', function () {
	function getComponentPath(type) {
		return require.resolve(`./src/components/component-${type}.svelte`)
	}

	function getFileContent(filePath) {
		return fs.readFileSync(filePath, 'utf-8')
	}

	const preprocessOptionsDefault = {

	}

	function preprocess(componentType, content, options = {}) {
		const filename = getComponentPath(componentType)
		if (!content) {
			content = getFileContent(filename)
		}

		return svelte.preprocess(content, {
			...preprocessOptionsDefault,
			filename,
			...options
		})
	}

	const compileOptionsDefault = {
		dev       : true,
		css       : true,
		generate  : true,
		hydratable: true,
		emitCss   : true,
		onwarn(warn) {
			assert.fail(warn.message)
		}
	}

	function compile(componentType, content, options = {}) {
		const filename = getComponentPath(componentType)
		if (!content) {
			content = getFileContent(filename)
		}

		return svelte.compile(content, {
			...compileOptionsDefault,
			filename,
			...options
		})
	}

	it('svelte', function () {
		let result = compile('no-style')
		assert.notOk(result.css.code)

		result = compile('css')
		assert.ok(result.css.code)
	})

	const cssLangs = ['scss'] // , 'less', 'stylus']
	const basePreprocessOptions = {
		scss   : true,
		postcss: {
			// see: https://github.com/postcss/postcss
			plugins: [postcssImport()]
		}
	}

	async function compileWithThemes(componentType, lang) {
		const themesFile = require.resolve(`./src/styles/${lang}/themes.${lang}`)
		const content = (await preprocess(componentType, null, themePreprocess(
			themesFile,
			basePreprocess(basePreprocessOptions).style,
			basePreprocess(basePreprocessOptions),
			{}
		))).toString()

		return compile(componentType, content, {})
	}

	it('preprocess', async function () {
		await Promise.all(cssLangs
			.map(async lang => {
				const compiled = await compileWithThemes('no-style', lang)

				console.log(compiled.css.code)

				assert.ok(compiled.css.code)
				assert.include(compiled.css.code, '.theme_dark h1')
				assert.include(compiled.css.code, '.theme_light h1')
				// assert.match(compiled.css.code, /^h1\b/)
			}))
	})
})
