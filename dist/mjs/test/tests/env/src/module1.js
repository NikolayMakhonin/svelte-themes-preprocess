/* eslint-disable quote-props,func-style,no-var */
export var func1 = function func1(p1) {
  for (var _len = arguments.length, params = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    params[_key - 1] = arguments[_key];
  }

  return "".concat(p1, " ").concat(params === null || params === void 0 ? void 0 : params.length);
};
export var var1 = 'var1';
export default {
  func1: func1,
  'var_1_1': var1,
  var_1_2: var1
};