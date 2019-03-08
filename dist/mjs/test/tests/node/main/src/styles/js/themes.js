import dark from './themes/theme_dark.js';
import light from './themes/theme_light.js';
export default (function (componentId) {
  return [dark(componentId), light(componentId)];
});