"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.main = main;
exports.default = void 0;

var _helpers = _interopRequireDefault(require("./helpers/helpers"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function main(args) {
  console.log(JSON.stringify(args));
}

var _default = {
  main
};
exports.default = _default;