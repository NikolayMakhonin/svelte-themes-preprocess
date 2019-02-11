"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _component = _interopRequireDefault(require("../../../main/browser/component.svelte"));

describe('Svelte component', function () {
  let testElem;
  beforeEach(() => {
    console.log(new Error('test'));
    testElem = document.createElement('test');
    document.body.appendChild(testElem);
  });

  function createComponent(data) {
    return new _component.default({
      target: document.querySelector('test'),
      data: { ...data
      }
    });
  }

  it('should initialize the count when no data is given', () => {
    const component = createComponent();
    const count = component.get('count');
    expect(count).toBe(0);
  });

  it('should start the count with given data', () => {
      const component = createComponent({count: 5})
      const count = component.get('count')
      expect(count).toBe(5)
      console.log(new Error('test'))
  })
});