"use strict";

var _main = _interopRequireDefault(require("../../../main/main"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe('main', function () {
  it('base', function () {
    _main.default.main('test');
  });
});