import _objectSpread from "@babel/runtime/helpers/objectSpread";
import Component from './src/component.svelte';
describe('browser > env > component', function () {
  var testElem;
  beforeEach(function () {
    testElem = document.createElement('test');
    document.body.appendChild(testElem);
  });

  function createComponent(data) {
    return new Component({
      target: document.querySelector('test'),
      data: _objectSpread({}, data)
    });
  }

  it('should initialize the count when no data is given', function () {
    var component = createComponent();
    var count = component.get('count');
    assert.strictEqual(count.count, 4);
  });
  it('should start the count with given data', function () {
    var component = createComponent({
      count: 5
    });
    var count = component.get('count');
    assert.strictEqual(count.count, 5);
  });
});