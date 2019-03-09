"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _theme_dark = _interopRequireDefault(require("./themes/theme_dark.js"));

var _theme_light = _interopRequireDefault(require("./themes/theme_light.js"));

var _default = componentId => [(0, _theme_dark.default)(componentId), ...[(0, _theme_light.default)(componentId)]];

exports.default = _default;