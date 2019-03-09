var params = {
  color: '#bbb'
};

module.exports = function (componentId) {
  return {
    ':global(.theme_light)': {
      h1: {
        color: params === null || params === void 0 ? void 0 : params.color,
        '-component': "\"".concat(componentId, "\"")
      }
    }
  };
};