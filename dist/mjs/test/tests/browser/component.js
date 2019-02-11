import _objectSpread from "@babel/runtime/helpers/objectSpread";
import Component from '../../../main/browser/component.svelte';
describe('Svelte component', function () {
  var testElem;
  beforeEach(function () {
    console.log(new Error('test'));
    testElem = document.createElement('test');
    document.body.appendChild(testElem);
  });

  function createComponent(data) {
    return new Component({
      target: document.querySelector('test'),
      data: _objectSpread({}, data)
    });
  }

  xit('should initialize the count when no data is given', function () {
    var component = createComponent();
    var count = test.get('count');
    expect(count).toBe(0);
  }); //
  // 	it('should start the count with given data', () => {
  // 		const component = createComponent({count: 5})
  // 		const count = test.get('count')
  // 		expect(count).toBe(5)
  // 		console.log(new Error('test'))
  // 	})
});