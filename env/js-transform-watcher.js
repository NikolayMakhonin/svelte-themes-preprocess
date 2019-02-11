/* eslint-disable no-shadow,global-require */
const files = process.argv.slice(2)
const fileInput = files[0]
const fileOutput = files[1]

const rollup = require('rollup')
const {createFilter} = require('rollup-pluginutils')

// const globals = require('rollup-plugin-node-globals')
// const builtins = require('rollup-plugin-node-builtins')
const babel = require('rollup-plugin-babel')
// const {terser} = require('rollup-plugin-terser')

// const { eslint } = require('rollup-plugin-eslint')
const nodeResolve = require('rollup-plugin-node-resolve')
const commonjs = require('rollup-plugin-commonjs')

function addHeaderFooterPlugin(options = {}) {
	const filter = createFilter(options.include, options.exclude)

	return {
		transform(code, id) {
			if (!filter(id)) {
				return null
			}

			return options.header
				+ code
				+ options.footer
		}
	}
}

function getCodeBetweenHeaderFooterPlugin(options = {}) {
	return {
		renderChunk(code) {
			const generatedCode = code
				.replace(new RegExp(`^.*${options.header.trim()}(.*?)${options.footer.trim()}.*?$`, 's'), '$1')
				.trim()

			return {
				code: generatedCode,
				map : null
			}
		}
	}
}

async function doRollup(file) {
	// eslint-disable-next-line no-useless-concat
	const markStartEnd = '//6c84fb9012c411e' + '1840d7b25c5ee775a\n'

	const bundle = await rollup.rollup({
		input  : file,
		plugins: [
			// globals(),
			// builtins(),
			babel(),
			nodeResolve(),
			// nodeResolve({
			// 	jsnext: true,
			// 	main: true,
			// 	browser: true,
			// 	preferBuiltins: true,
			// }),
			commonjs(),
			babel(),
			addHeaderFooterPlugin({
				include: file,
				header : markStartEnd,
				footer : markStartEnd
			}),
			getCodeBetweenHeaderFooterPlugin({
				header: markStartEnd,
				footer: markStartEnd
			}),
			// terser({
			// 	mangle   : false,
			// 	sourcemap: false,
			// 	// {
			// 	// 	content: 'inline',
			// 	// 	url: 'inline'
			// 	// },
			// 	output   : {
			// 		beautify: true
			// 	}
			// })
		]
	})

	const {code} = await bundle.generate({
		format   : 'cjs',
		sourcemap: false,
		exports  : 'named'
	})

	return code
}

function getEqualStartLength(s1, s2) {
	const len = Math.min(s1.length, s2.length)
	for (let i = 0; i < len; i++) {
		if (s1[i] !== s2[i]) {
			return i
		}
	}

	return len
}

function removeEqualStart(s1, s2) {
	const len = getEqualStartLength(s1, s2)
	return {
		s1: s1.substr(len),
		s2: s2.substr(len)
	}
}

const {s1: relativeInput, s2: relativeOutput} = removeEqualStart(fileInput, fileOutput)
if (!relativeOutput.match(/^tmp[\\/]/)) {
	throw new Error(`fileOutput is not in ./tmp: ${relativeOutput}`)
}

console.log(`js watcher transform: ${relativeInput} => ${relativeOutput}`)

async function transform(fileInput, fileOutput) {
	let content = await doRollup(fileInput)

	if (!content) {
		throw new Error('transformed content is empty')
	}

	const fs = require('fs')
	const fse = require('fs-extra')
	const path = require('path')
	const beautify = require('js-beautify').js

	content = beautify(content)

	const dirOutput = path.dirname(fileOutput)
	if (!await fse.pathExists(dirOutput)) {
		await fse.mkdirp(dirOutput)
	}

	fs.writeFile(fileOutput, content, function (err) {
		if (err) {
			console.log(err)
			throw err
		}
	})
}

transform(fileInput, fileOutput)
	.then(() => {
		console.log('js watcher transform: successful!')
	})
