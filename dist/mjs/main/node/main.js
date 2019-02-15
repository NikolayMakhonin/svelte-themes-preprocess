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
      }, _callee, this);
    }));

    function getComponentId(_x) {
      return _getComponentId.apply(this, arguments);
    }

    return getComponentId;
  }()
};
export default function themesPreprocess(themesFilePath, prePreprocessStyle, postPreprocess) {
  var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

  if (!themesFilePath) {
    throw new Error('themesFilePath is empty');
  }

  if (!prePreprocessStyle) {
    throw new Error('prePreprocessStyle is null');
  }

  if (!postPreprocess) {
    throw new Error('postPreprocess is null');
  }

  themesFilePath = require.resolve(themesFilePath).replace(/\\/g, '/').replace(/\.[^/.]+$/, '');
  options = _objectSpread({}, optionsDefault, options);
  return _objectSpread({}, postPreprocess, {
    // add <style> tags if not exists
    markup: function markup(_ref) {
      var _ref$content = _ref.content,
          content = _ref$content === void 0 ? '' : _ref$content,
          other = _objectWithoutProperties(_ref, ["content"]);

      if (content.indexOf('</style>') < 0) {
        content = "".concat(content, "\r\n<style></style>");
      }

      return postPreprocess.markup.call(this, _objectSpread({
        content: content
      }, other));
    },
    // append themes css
    style: function () {
      var _style = _asyncToGenerator(
      /*#__PURE__*/
      _regeneratorRuntime.mark(function _callee2(input) {
        var componentId, themesContent, themes, style;
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
                _context2.t0 = options.lang;
                _context2.next = _context2.t0 === 'scss' ? 8 : _context2.t0 === 'less' ? 10 : _context2.t0 === 'stylus' ? 12 : 14;
                break;

              case 8:
                themesContent = '\r\n' + "$component: '".concat(componentId, "';\r\n") + "@import '".concat(themesFilePath, "';\r\n");
                return _context2.abrupt("break", 15);

              case 10:
                themesContent = '\r\n' + "@component: '".concat(componentId, "';\r\n") + "@import '".concat(themesFilePath, "';\r\n");
                return _context2.abrupt("break", 15);

              case 12:
                themesContent = '\r\n' + "$component = '".concat(componentId, "'\r\n") + "@import '".concat(themesFilePath, "';\r\n");
                return _context2.abrupt("break", 15);

              case 14:
                throw new Error("unsupported css lang: ".concat(options.lang));

              case 15:
                _context2.next = 17;
                return postPreprocess.style.call(this, _objectSpread({}, input, {
                  content: themesContent,
                  attributes: {
                    lang: options.lang
                  }
                }));

              case 17:
                themes = _context2.sent;
                _context2.next = 20;
                return postPreprocess.style.call(this, input);

              case 20:
                style = _context2.sent;
                return _context2.abrupt("return", {
                  code: "".concat(style.code || '', "\r\n").concat(themes.code || ''),
                  map: style.map
                });

              case 22:
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