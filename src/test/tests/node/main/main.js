import * as svelte from 'svelte'
import fs from 'fs'
import themesPreprocess from '../../../../main/node/main'
import basePreprocess from 'svelte-preprocess'
import postcss from 'postcss'
import postcssImport from 'postcss-import'
import postcssNested from 'postcss-nested'
import postcssGlobalNested from 'postcss-global-nested'
import postcssJsSyntax from 'postcss-js-syntax'
import {requireFromString} from 'require-from-memory'
import 'core-js/fn/array/flat-map'

describe('node > main > main', function () {
	function getComponentPath(type) {
		return require.resolve(`./src/components/component-${type}.svelte`)
	}

	function getFileContent(filePath) {
		return fs.readFileSync(filePath, 'utf-8')
	}

	const preprocessOptionsDefault = {}

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

	const postcssPlugins = [
		postcssImport(),
		postcssNested(),
		postcssGlobalNested()
	]

	const postcssInstance = postcss(postcssPlugins)

	const basePreprocessOptions = {
		transformers: {
			scss  : true,
			less  : true,
			stylus: true,
			async javascript({content, filename}) {
				const parsed = await postcssInstance.process(content, {
					from  : `${filename}.js`,
					parser: postcssJsSyntax.parse,
					requireFromString
				})

				return {
					code: parsed.css
				}
			},
			postcss: {
				// see: https://github.com/postcss/postcss
				plugins: postcssPlugins
			}
		}
	}

	basePreprocessOptions.transformers.jss = basePreprocessOptions.transformers.javascript

	async function compileWithThemes(componentType, lang) {
		// eslint-disable-next-line no-nested-ternary
		const fileExt = lang === 'stylus'
			? 'styl'
			: lang === 'jss' ? 'js' : lang
		const themesFile = require.resolve(`./src/styles/${lang === 'jss' ? 'js' : lang}/themes.${fileExt}`)
		const content = (await preprocess(componentType, null, themesPreprocess(
			themesFile,
			basePreprocess(basePreprocessOptions),
			{
				lang,
				langs: {
					jss(componentId, themesFilePath) {
						return `
var themeBuilder = require('${themesFilePath.replace(/'/g, '\'')}')
if (themeBuilder.__esModule) {
	themeBuilder = themeBuilder.default
}
module.exports = themeBuilder('${componentId.replace(/'/g, '\'')}')
`
					}
				}
			}
		))).toString()

		return compile(componentType, content, {})
	}

	it('base', async () => {
		const themesFile = require.resolve('./src/styles/scss/themes.scss')
		let preprocessor = themesPreprocess(themesFile, basePreprocess(basePreprocessOptions), {
			debug: {
				showComponentsIds: true
			}
		})
		await preprocess('scss', null, preprocessor)
		preprocessor = themesPreprocess(themesFile, {style: basePreprocess(basePreprocessOptions).style})
		await preprocess('scss', null, preprocessor)

		assert.throws(() => themesPreprocess(), Error)
		assert.throws(() => themesPreprocess('x', basePreprocess(basePreprocessOptions)), Error)
		assert.throws(() => themesPreprocess('', basePreprocess(basePreprocessOptions)), Error)
		assert.throws(() => themesPreprocess(themesFile), Error)
		assert.throws(() => themesPreprocess(themesFile, {}), Error)
		assert.throws(() => themesPreprocess(themesFile, {style: 'x'}), Error)
		themesPreprocess(themesFile, {
			// eslint-disable-next-line no-empty-function
			style() { }
		})
	})

	const cssLangs = ['scss', 'less', 'stylus', 'jss', 'jss']
	const componentTypes = ['js', 'scss', 'no-style', 'css', 'less', 'stylus']
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
