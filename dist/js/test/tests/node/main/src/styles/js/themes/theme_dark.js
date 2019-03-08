"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _default = componentId => ({
  ':global(.theme_dark)': {
    h1: {
      color: '#bbb',
      '-component': `"${componentId}"`
    }
  }
});

exports.default = _default;