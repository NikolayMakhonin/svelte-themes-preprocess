import _defineProperty from "@babel/runtime/helpers/defineProperty";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

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
      props: _objectSpread({}, data)
    });
  }

  it('should initialize the count when no data is given', function () {
    var component = createComponent();
    var count = component.count;
    assert.strictEqual(count, 4);
  });
  it('should start the count with given data', function () {
    var component = createComponent({
      count: 5
    });
    var count = component.count;
    assert.strictEqual(count, 5);
  });
});