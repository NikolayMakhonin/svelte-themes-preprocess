"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _main = _interopRequireDefault(require("../../../../main/common/main"));

describe('main', function () {
  it('base', function () {
    _main.default.main('test');
  });
});