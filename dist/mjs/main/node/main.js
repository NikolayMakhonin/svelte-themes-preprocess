import _objectWithoutProperties from "@babel/runtime/helpers/objectWithoutProperties";
import _objectSpread from "@babel/runtime/helpers/objectSpread";
import _regeneratorRuntime from "@babel/runtime/regenerator";
import _asyncToGenerator from "@babel/runtime/helpers/asyncToGenerator";
// import preprocess from 'svelte-preprocess'
// import fs from 'fs'
// import path from 'path'
import unresolve from 'unresolve';
var optionsDefault = {
  lang: 'scss',
  getComponentId: function () {
    var _getComponentId = _asyncToGenerator(
    /*#__PURE__*/
    _regeneratorRuntime.mark(function _callee(filename) {
      return _regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.next = 2;
              return unresolve(filename);

            case 2:
              return _context.abrupt("return", _context.sent.replace(/\\/g, '/').replace(/\.[^/.]+$/, ''));

            case 3:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    }));

    function getComponentId(_x) {
      return _getComponentId.apply(this, arguments);
    }

    return getComponentId;
  }()
};
export default function themesPreprocess(themesFilePath, preprocess) {
  var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

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

  themesFilePath = require.resolve(themesFilePath).replace(/\\/g, '/');
  options = _objectSpread({}, optionsDefault, options, {
    langs: _objectSpread({
      scss: function scss(componentId, themesPath) {
        return '\r\n' + "$component: '".concat(componentId.replace(/'/g, '\''), "';\r\n") + "@import '".concat(themesPath.replace(/'/g, '\''), "';\r\n");
      },
      less: function less(componentId, themesPath) {
        return '\r\n' + "@component: '".concat(componentId.replace(/'/g, '\''), "';\r\n") + "@import '".concat(themesPath.replace(/'/g, '\''), "';\r\n");
      },
      stylus: function stylus(componentId, themesPath) {
        return '\r\n' + "$component = '".concat(componentId.replace(/'/g, '\''), "'\r\n") + "@import '".concat(themesPath.replace(/'/g, '\''), "';\r\n");
      },
      js: function js(componentId, themesPath) {
        return "\n\t\t\t\t\tvar themeBuilder = require('".concat(themesPath.replace(/'/g, '\''), "')\n\t\t\t\t\tif (themeBuilder.__esModule) {\n\t\t\t\t\t\tthemeBuilder = themeBuilder.default\n\t\t\t\t\t}\n\t\t\t\t\tmodule.exports = themeBuilder('").concat(componentId.replace(/'/g, '\''), "')\n\t\t\t\t");
      }
    }, options.langs)
  });
  return _objectSpread({}, preprocess, {
    // add <style> tags if not exists
    markup: function markup(_ref) {
      var _ref$content = _ref.content,
          content = _ref$content === void 0 ? '' : _ref$content,
          other = _objectWithoutProperties(_ref, ["content"]);

      if (content.indexOf('</style>') < 0) {
        content = "".concat(content, "\r\n<style></style>");
      }

      if (preprocess.markup) {
        return preprocess.markup.call(this, _objectSpread({
          content: content
        }, other));
      }

      return {
        code: content,
        map: null
      };
    },
    // append themes css
    style: function () {
      var _style = _asyncToGenerator(
      /*#__PURE__*/
      _regeneratorRuntime.mark(function _callee2(input) {
        var _options, _options$debug;

        var componentId, getThemesContent, themesContent, themes, style;
        return _regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                if (input.filename) {
                  _context2.next = 2;
                  break;
                }

                throw new Error('svelte preprocess filename must be provided');

              case 2:
                _context2.next = 4;
                return options.getComponentId(input.filename);

              case 4:
                componentId = _context2.sent;

                if ((_options = options) === null || _options === void 0 ? void 0 : (_options$debug = _options.debug) === null || _options$debug === void 0 ? void 0 : _options$debug.showComponentsIds) {
                  console.log("Component id for themes: ".concat(componentId));
                }

                getThemesContent = options.langs[options.lang];

                if (getThemesContent) {
                  _context2.next = 9;
                  break;
                }

                throw new Error("unsupported css lang: ".concat(options.lang));

              case 9:
                themesContent = getThemesContent(componentId, themesFilePath);
                _context2.next = 12;
                return preprocess.style.call(this, _objectSpread({}, input, {
                  content: themesContent,
                  attributes: {
                    lang: options.lang
                  }
                }));

              case 12:
                themes = _context2.sent;
                _context2.next = 15;
                return preprocess.style.call(this, input);

              case 15:
                style = _context2.sent;
                return _context2.abrupt("return", {
                  code: "".concat(style.code || '', "\r\n").concat(themes.code || ''),
                  map: style.map
                });

              case 17:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function style(_x2) {
        return _style.apply(this, arguments);
      }

      return style;
    }()
  });
}