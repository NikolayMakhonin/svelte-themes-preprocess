"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.main = main;
exports.default = void 0;

var _helpers = _interopRequireDefault(require("./helpers/helpers"));

function main(args) {
  console.log(JSON.stringify(args), _helpers.default.test);
}

var _default = {
  main
};
exports.default = _default;