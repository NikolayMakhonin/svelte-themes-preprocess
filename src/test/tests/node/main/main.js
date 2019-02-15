import * as svelte from 'svelte'
import fs from 'fs'
import themesPreprocess from '../../../../main/node/main'
import basePreprocess from 'svelte-preprocess'
import postcssImport from 'postcss-import'
import 'core-js/fn/array/flat-map'

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

		try {
			return svelte.compile(content, {
				...compileOptionsDefault,
				filename,
				...options
			})
		} catch (ex) {
			console.error('Error compile svelte:\r\n', content, ex)
			assert.fail()
			return null
		}
	}

	it('svelte', function () {
		let result = compile('no-style')
		assert.notOk(result.css.code)

		result = compile('css')
		assert.ok(result.css.code)
	})
	const basePreprocessOptions = {
		scss   : true,
		less   : true,
		stylus : true,
		postcss: {
			// see: https://github.com/postcss/postcss
			plugins: [postcssImport()]
		}
	}

	async function compileWithThemes(componentType, lang) {
		const fileExt = lang === 'stylus' ? 'styl' : lang
		const themesFile = require.resolve(`./src/styles/${lang}/themes.${fileExt}`)
		const content = (await preprocess(componentType, null, themesPreprocess(
			themesFile,
			basePreprocess(basePreprocessOptions),
			{lang}
		))).toString()

		return compile(componentType, content, {})
	}

	it('base', async () => {
		const themesFile = require.resolve('./src/styles/scss/themes.scss')
		let preprocessor = themesPreprocess(themesFile, basePreprocess(basePreprocessOptions))
		await preprocess('scss', null, preprocessor)
		preprocessor = themesPreprocess(themesFile, {style: basePreprocess(basePreprocessOptions).style})
		await preprocess('scss', null, preprocessor)

		assert.throws(() => themesPreprocess(), Error)
		assert.throws(() => themesPreprocess('x', basePreprocess(basePreprocessOptions)), Error)
		assert.throws(() => themesPreprocess('', basePreprocess(basePreprocessOptions)), Error)
		assert.throws(() => themesPreprocess(themesFile), Error)
		assert.throws(() => themesPreprocess(themesFile, {}), Error)
		assert.throws(() => themesPreprocess(themesFile, {style: 'x'}), Error)
		// eslint-disable-next-line no-empty-function
		themesPreprocess(themesFile, {style() {}})
	})

	const cssLangs = ['scss', 'less', 'stylus']
	const componentTypes = ['no-style', 'css', 'scss', 'less', 'stylus']
	// const cssLangs = ['scss']
	// const componentTypes = ['less']

	it('preprocess', async function () {
		this.timeout(60000)

		await Promise.all(cssLangs
			.flatMap(lang => componentTypes
				.map(async componentType => {
					const compiled = await compileWithThemes(componentType, lang)

					console.log(componentType, lang)

					assert.ok(compiled.css.code)
					assert.include(compiled.css.code, '.theme_dark h1')
					assert.include(compiled.css.code, '.theme_light h1')
					assert.match(compiled.css.code, new RegExp(`component:\\s*["'][^"']*component-${componentType}["']`))

					if (componentType === 'no-style') {
						assert.match(compiled.css.code, /^\.theme_/)
						assert.notMatch(compiled.css.code, /component-type/)
					} else {
						assert.match(compiled.css.code, /^h1\b/)
						assert.match(compiled.css.code, new RegExp(`component-type:\\s*["']${componentType}["']`))
					}
				})))
	})
})
