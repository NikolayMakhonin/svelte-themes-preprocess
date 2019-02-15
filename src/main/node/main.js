// import preprocess from 'svelte-preprocess'
// import fs from 'fs'
// import path from 'path'
import unresolve from 'unresolve'

const optionsDefault = {
	lang: 'scss',
	async getComponentId(filename) {
		return (await unresolve(filename))
			.replace(/\\/g, '/')
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

	options = {
		...optionsDefault,
		...options
	}

	return {
		...postPreprocess,
		markup({content = ''}) {
			if (content.indexOf('</style>') >= 0) {
				return {
					code: content
				}
			}

			console.log(content)

			return {
				code: `${content}\r\n<style></style>`
			}
		},
		async style(input) {
			console.log('qwe', input)
			if (!input.filename) {
				throw new Error('svelte preprocess filename must be provided')
			}

			const componentId = await options.getComponentId(input.filename)

			// let content = (await postPreprocess.style.call(this, input)).code || ''
			let content = input.content || ''

			switch (options.lang) {
				case 'scss':
					content += '\r\n'
						+ `$component: '${componentId}';\r\n`
						+ `@import '${themesFilePath}';\r\n`
					break
				default:
					throw new Error(`unsupported css lang: ${options.lang}`)
			}

			const attributes = {...input.attributes}
			delete attributes.type
			attributes.lang = options.lang

			return postPreprocess.style.call(this, {
				...input,
				content,
				attributes
			})
		}
	}
}
