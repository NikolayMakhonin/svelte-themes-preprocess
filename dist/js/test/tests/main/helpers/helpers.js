"use strict";

var _helpers = _interopRequireDefault(require("../../../../main/helpers/helpers"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe('helpers', function () {
  it('base', function () {
    assert.strictEqual(_helpers.default.test, 'test');
  });
});