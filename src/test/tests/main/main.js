import main from '../../../main/main'

describe('main', function () {
	it('base', function () {
		main.main('node index.js -x 4 -y 5')
	})
})
