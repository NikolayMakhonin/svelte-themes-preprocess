require('./register-tests')
const path = require('path')
const registerBabel = require('@babel/register')
const babelrc = require('../.babelrc')

function normalizePath(filepath) {
	return path.relative(process.cwd(), filepath).replace(/\\/g, '/')
}

function testDir(filepath, dirPath) {
	return new RegExp(`^${dirPath}/`).test(normalizePath(filepath))
}

registerBabel({
	only: [
		function (filepath) {
			return !testDir(filepath, 'node_modules')
			// || testDir(filepath, 'node_modules/less')
		},
	],
	babelrcRoots: true,
	...babelrc
})
