var _require;

/* eslint-disable global-require */
var dark = require('./themes/theme_dark.js');

var light = (_require = require('./themes/theme_light.js')) === null || _require === void 0 ? void 0 : _require["default"];

module.exports = function (componentId) {
  return [dark(componentId)].concat([light(componentId)]);
};