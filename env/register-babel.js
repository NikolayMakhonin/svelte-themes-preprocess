require('./register-tests')
const registerBabel = require('@babel/register')

registerBabel({
	// This will override `node_modules` ignoring - you can alternatively pass
	// an array of strings to be explicitly matched or a regex / glob
	ignore      : ['node_modules'],
	// only        : [/.*/],
	babelrcRoots: true
})
