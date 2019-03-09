"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
const params = {
  color: '#bbb'
};

var _default = componentId => ({
  ':global(.theme_dark)': {
    h1: {
      color: params === null || params === void 0 ? void 0 : params.color,
      '-component': `"${componentId}"`
    }
  }
});

exports.default = _default;