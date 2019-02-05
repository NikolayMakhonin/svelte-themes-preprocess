import index from '../../src'

describe('index', function () {
	it('base', function () {
		console.log(JSON.stringify(index.args, null, 4))
		assert.ok(index.args)
		assert.ok(index.args._)
	})
})
