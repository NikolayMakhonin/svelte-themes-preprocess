import themePreprocess from '../../../main/node/main'

describe('main', function () {
	it('base', function () {
		const result = themePreprocess({test: 123})
		assert.strictEqual(result, undefined)
	})
})
