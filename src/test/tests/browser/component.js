import Component from '../../../main/browser/component.svelte'

describe('Svelte component', function () {
	let testElem

	beforeEach(() => {
		testElem = document.createElement('test')
		document.body.appendChild(testElem)
	})

	function createComponent(data) {
		return new Component({
			target: document.querySelector('test'),
			data: {...data},
		})
	}

	it('should initialize the count when no data is given', () => {
		const component = createComponent()
		const count = component.get('count')
		assert.strictEqual(count.count, 0)
	})

	it('should start the count with given data', () => {
		const component = createComponent({count: 5})
		const count = component.get('count')
		assert.strictEqual(count.count, 5)
	})
})
