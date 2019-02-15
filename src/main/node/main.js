// import preprocess from 'svelte-preprocess'
// import fs from 'fs'
// import path from 'path'
import unresolve from 'unresolve'

const optionsDefault = {
	lang: 'scss',
	async getComponentId(filename) {
		return (await unresolve(filename))
			.replace(/\\/g, '/')
			.replace(/\.[^/.]+$/, '')
	}
}

export default function themesPreprocess(themesFilePath, prePreprocessStyle, postPreprocess, options = {}) {
	if (!themesFilePath) {
		throw new Error('themesFilePath is empty')
	}

	if (!prePreprocessStyle) {
		throw new Error('prePreprocessStyle is null')
	}

	if (!postPreprocess) {
		throw new Error('postPreprocess is null')
	}

	themesFilePath = require.resolve(themesFilePath)
		.replace(/\\/g, '/')
		.replace(/\.[^/.]+$/, '')

	options = {
		...optionsDefault,
		...options
	}

	return {
		...postPreprocess,

		// add <style> tags if not exists
		markup({content = '', ...other}) {
			if (content.indexOf('</style>') < 0) {
				content = `${content}\r\n<style></style>`
			}

			return postPreprocess.markup.call(this, {
				content,
				...other
			})
		},

		// append themes css
		async style(input) {
			if (!input.filename) {
				throw new Error('svelte preprocess filename must be provided')
			}

			const componentId = await options.getComponentId(input.filename)

			let themesContent
			switch (options.lang) {
				case 'scss':
					themesContent = '\r\n'
						+ `$component: '${componentId}';\r\n`
						+ `@import '${themesFilePath}';\r\n`
					break
				case 'less':
					themesContent = '\r\n'
						+ `@component: '${componentId}';\r\n`
						+ `@import '${themesFilePath}';\r\n`
					break
				case 'stylus':
					themesContent = '\r\n'
						+ `$component = '${componentId}'\r\n`
						+ `@import '${themesFilePath}';\r\n`
					break
				default:
					throw new Error(`unsupported css lang: ${options.lang}`)
			}

			const themes = await postPreprocess.style.call(this, {
				...input,
				content   : themesContent,
				attributes: {
					lang: options.lang
				}
			})

			const style = await postPreprocess.style.call(this, input)

			return {
				code: `${style.code || ''}\r\n${themes.code || ''}`,
				map : style.map
			}
		}
	}
}
