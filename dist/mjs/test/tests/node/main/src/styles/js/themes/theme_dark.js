export default (function (componentId) {
  return {
    ':global(.theme_dark)': {
      h1: {
        color: '#bbb',
        '-component': "\"".concat(componentId, "\"")
      }
    }
  };
});