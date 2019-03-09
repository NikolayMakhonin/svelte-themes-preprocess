"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = themesPreprocess;

var _unresolve = _interopRequireDefault(require("unresolve"));

// import preprocess from 'svelte-preprocess'
// import fs from 'fs'
// import path from 'path'
const optionsDefault = {
  lang: 'scss',

  async getComponentId(filename) {
    return (await (0, _unresolve.default)(filename)).replace(/\\/g, '/').replace(/\.[^/.]+$/, '');
  }

};

function themesPreprocess(themesFilePath, preprocess, options = {}) {
  if (!themesFilePath) {
    throw new Error('argument "themesFilePath" is empty and should be specified');
  }

  if (!preprocess) {
    throw new Error('argument "preprocess" is null and should be specified');
  }

  if (!preprocess.style) {
    throw new Error('argument "preprocess.style" is null and should be specified');
  }

  if (typeof preprocess.style !== 'function') {
    throw new Error('argument "preprocess.style" is not a function');
  }

  themesFilePath = require.resolve(themesFilePath).replace(/\\/g, '/').replace(/\.[^/.]+$/, '');
  options = { ...optionsDefault,
    ...options,
    langs: {
      scss(componentId, themesPath) {
        return '\r\n' + `$component: '${componentId.replace(/'/g, '\'')}';\r\n` + `@import '${themesPath.replace(/'/g, '\'')}';\r\n`;
      },

      less(componentId, themesPath) {
        return '\r\n' + `@component: '${componentId.replace(/'/g, '\'')}';\r\n` + `@import '${themesPath.replace(/'/g, '\'')}';\r\n`;
      },

      stylus(componentId, themesPath) {
        return '\r\n' + `$component = '${componentId.replace(/'/g, '\'')}'\r\n` + `@import '${themesPath.replace(/'/g, '\'')}';\r\n`;
      },

      js(componentId, themesPath) {
        return `
					var themeBuilder = require('${themesPath.replace(/'/g, '\'')}')
					if (themeBuilder.__esModule) {
						themeBuilder = themeBuilder.default
					}
					module.exports = themeBuilder('${componentId.replace(/'/g, '\'')}')
				`;
      },

      ...options.langs
    }
  };
  return { ...preprocess,

    // add <style> tags if not exists
    markup({
      content = '',
      ...other
    }) {
      if (content.indexOf('</style>') < 0) {
        content = `${content}\r\n<style></style>`;
      }

      if (preprocess.markup) {
        return preprocess.markup.call(this, {
          content,
          ...other
        });
      }

      return {
        code: content,
        map: null
      };
    },

    // append themes css
    async style(input) {
      var _options, _options$debug;

      if (!input.filename) {
        throw new Error('svelte preprocess filename must be provided');
      }

      const componentId = await options.getComponentId(input.filename);

      if ((_options = options) === null || _options === void 0 ? void 0 : (_options$debug = _options.debug) === null || _options$debug === void 0 ? void 0 : _options$debug.showComponentsIds) {
        console.log(`Component id for themes: ${componentId}`);
      }

      const getThemesContent = options.langs[options.lang];

      if (!getThemesContent) {
        throw new Error(`unsupported css lang: ${options.lang}`);
      }

      const themesContent = getThemesContent(componentId, themesFilePath);
      const themes = await preprocess.style.call(this, { ...input,
        content: themesContent,
        attributes: {
          lang: options.lang
        }
      });
      const style = await preprocess.style.call(this, input);
      return {
        code: `${style.code || ''}\r\n${themes.code || ''}`,
        map: style.map
      };
    }

  };
}