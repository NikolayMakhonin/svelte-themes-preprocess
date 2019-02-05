require('chai/register-assert')
const babelRegister = require('@babel/register')

babelRegister({
	// This will override `node_modules` ignoring - you can alternatively pass
	// an array of strings to be explicitly matched or a regex / glob
	ignore      : ['node_modules'],
	only        : [/.*/],
	babelrcRoots: true
})
