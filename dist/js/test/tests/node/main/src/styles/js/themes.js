"use strict";

var _require;

/* eslint-disable global-require */
const dark = require('./themes/theme_dark.js');

const light = (_require = require('./themes/theme_light.js')) === null || _require === void 0 ? void 0 : _require.default;

module.exports = componentId => [...[dark(componentId)], light(componentId)];