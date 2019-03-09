var params = {
  color: '#bbb'
};
export default (function (componentId) {
  return {
    ':global(.theme_light)': {
      h1: {
        color: params === null || params === void 0 ? void 0 : params.color,
        '-component': "\"".concat(componentId, "\"")
      }
    }
  };
});