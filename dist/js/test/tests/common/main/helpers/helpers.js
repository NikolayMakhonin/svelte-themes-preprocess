"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _helpers = _interopRequireDefault(require("../../../../../main/common/helpers/helpers"));

describe('common > main > helpers > helpers', function () {
  it('base', function () {
    assert.strictEqual(_helpers.default.test, 'test');
  });
});