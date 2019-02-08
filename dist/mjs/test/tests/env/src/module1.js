/* eslint-disable quote-props,func-style,no-var */
export var func1 = function func1(p1) {
  return "".concat(p1, " ").concat(p1 === null || p1 === void 0 ? void 0 : p1.length, " ").concat(arguments.length <= 1 ? 0 : arguments.length - 1);
};
export var var1 = 'var1';
export default {
  func1: func1,
  'var_1_1': var1,
  var_1_2: var1
};