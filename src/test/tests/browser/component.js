import Component from '../../../main/browser/component.svelte'

describe('Svelte component', function () {
	let testElem

	beforeEach(() => {
		console.log(new Error('test'))
		testElem = document.createElement('test')
		document.body.appendChild(testElem)
	})

	function createComponent(data) {
		return new Component({
			target: document.querySelector('test'),
			data: {...data},
		})
	}

	xit('should initialize the count when no data is given', () => {
		const component = createComponent()
		const count = test.get('count')
		expect(count).toBe(0)
	})
//
// 	it('should start the count with given data', () => {
// 		const component = createComponent({count: 5})
// 		const count = test.get('count')
// 		expect(count).toBe(5)
// 		console.log(new Error('test'))
// 	})
})
