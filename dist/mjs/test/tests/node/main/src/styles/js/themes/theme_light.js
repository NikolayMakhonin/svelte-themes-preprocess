export default (function (componentId) {
  return {
    ':global(.theme_light)': {
      h1: {
        color: '#bbb',
        '-component': "\"".concat(componentId, "\"")
      }
    }
  };
});