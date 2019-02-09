"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.var1 = exports.func1 = void 0;

/* eslint-disable quote-props,func-style,no-var */
const func1 = function (p1, ...params) {
  return `${p1} ${p1 === null || p1 === void 0 ? void 0 : p1.length} ${params.length}`;
};

exports.func1 = func1;
var var1 = 'var1';
exports.var1 = var1;
var _default = {
  func1,
  'var_1_1': var1,
  var_1_2: var1
};
exports.default = _default;