/* eslint-disable no-new-func */

describe('browser', function () {
	it('isBrowser', function () {
		// see: https://stackoverflow.com/a/31090240/5221762
		const isBrowser = new Function('try {return this===window;}catch(e){ return false;}')
		console.log(`${new Date()} isBrowser = ${isBrowser()};`)
		assert.strictEqual(isBrowser(), true)
	})
})
