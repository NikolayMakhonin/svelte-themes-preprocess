"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _helpers = _interopRequireDefault(require("../../../../main/helpers/helpers"));

describe('helpers', function () {
  it('base', function () {
    assert.strictEqual(_helpers.default.test, 'test');
  });
});