"use strict";

const params = {
  color: '#bbb'
};

module.exports = componentId => ({
  ':global(.theme_dark)': {
    h1: {
      color: params === null || params === void 0 ? void 0 : params.color,
      '-component': `"${componentId}"`
    }
  }
});