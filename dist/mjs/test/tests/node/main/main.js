import _regeneratorRuntime from "@babel/runtime/regenerator";
import _asyncToGenerator from "@babel/runtime/helpers/asyncToGenerator";
import _objectSpread from "@babel/runtime/helpers/objectSpread";
import * as svelte from 'svelte';
import fs from 'fs';
import themesPreprocess from '../../../../main/node/main';
import basePreprocess from 'svelte-preprocess';
import postcss from 'postcss';
import postcssImport from 'postcss-import';
import postcssNested from 'postcss-nested';
import postcssGlobalNested from 'postcss-global-nested';
import postcssJsSyntax from 'postcss-js-syntax';
import { requireFromString } from 'require-from-memory';
import 'core-js/fn/array/flat-map';
describe('node > main > main', function () {
  function getComponentPath(type) {
    return require.resolve("./src/components/component-".concat(type, ".svelte"));
  }

  function getFileContent(filePath) {
    return fs.readFileSync(filePath, 'utf-8');
  }

  var preprocessOptionsDefault = {};

  function preprocess(componentType, content) {
    var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    var filename = getComponentPath(componentType);

    if (!content) {
      content = getFileContent(filename);
    }

    return svelte.preprocess(content, _objectSpread({}, preprocessOptionsDefault, {
      filename: filename
    }, options));
  }

  var compileOptionsDefault = {
    dev: true,
    css: true,
    generate: true,
    hydratable: true,
    emitCss: true,
    onwarn: function onwarn(warn) {
      assert.fail(warn.message);
    }
  };

  function compile(componentType, content) {
    var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    var filename = getComponentPath(componentType);

    if (!content) {
      content = getFileContent(filename);
    }

    try {
      return svelte.compile(content, _objectSpread({}, compileOptionsDefault, {
        filename: filename
      }, options));
    } catch (ex) {
      console.error('Error compile svelte:\r\n', content, ex);
      assert.fail();
      return null;
    }
  }

  it('svelte', function () {
    var result = compile('no-style');
    assert.notOk(result.css.code);
    result = compile('css');
    assert.ok(result.css.code);
  });
  var postcssPlugins = [postcssImport(), postcssNested(), postcssGlobalNested()];
  var postcssInstance = postcss(postcssPlugins);
  var basePreprocessOptions = {
    transformers: {
      scss: true,
      less: true,
      stylus: true,
      javascript: function () {
        var _javascript = _asyncToGenerator(
        /*#__PURE__*/
        _regeneratorRuntime.mark(function _callee(_ref) {
          var content, filename, parsed;
          return _regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
              switch (_context.prev = _context.next) {
                case 0:
                  content = _ref.content, filename = _ref.filename;
                  _context.next = 3;
                  return postcssInstance.process(content, {
                    from: "".concat(filename, ".js"),
                    parser: postcssJsSyntax.parse,
                    requireFromString: requireFromString
                  });

                case 3:
                  parsed = _context.sent;
                  return _context.abrupt("return", {
                    code: parsed.css
                  });

                case 5:
                case "end":
                  return _context.stop();
              }
            }
          }, _callee);
        }));

        function javascript(_x) {
          return _javascript.apply(this, arguments);
        }

        return javascript;
      }(),
      postcss: {
        // see: https://github.com/postcss/postcss
        plugins: postcssPlugins
      }
    }
  };
  basePreprocessOptions.transformers.jss = basePreprocessOptions.transformers.javascript;

  function compileWithThemes(_x2, _x3) {
    return _compileWithThemes.apply(this, arguments);
  }

  function _compileWithThemes() {
    _compileWithThemes = _asyncToGenerator(
    /*#__PURE__*/
    _regeneratorRuntime.mark(function _callee5(componentType, lang) {
      var fileExt, themesFile, content;
      return _regeneratorRuntime.wrap(function _callee5$(_context5) {
        while (1) {
          switch (_context5.prev = _context5.next) {
            case 0:
              // eslint-disable-next-line no-nested-ternary
              fileExt = lang === 'stylus' ? 'styl' : lang === 'jss' ? 'js' : lang;
              themesFile = require.resolve("./src/styles/".concat(lang === 'jss' ? 'js' : lang, "/themes.").concat(fileExt));
              _context5.next = 4;
              return preprocess(componentType, null, themesPreprocess(themesFile, basePreprocess(basePreprocessOptions), {
                lang: lang,
                langs: {
                  jss: function jss(componentId, themesFilePath) {
                    return "\nvar themeBuilder = require('".concat(themesFilePath.replace(/'/g, '\''), "')\nif (themeBuilder.__esModule) {\n\tthemeBuilder = themeBuilder.default\n}\nmodule.exports = themeBuilder('").concat(componentId.replace(/'/g, '\''), "')\n");
                  }
                }
              }));

            case 4:
              content = _context5.sent.toString();
              return _context5.abrupt("return", compile(componentType, content, {}));

            case 6:
            case "end":
              return _context5.stop();
          }
        }
      }, _callee5);
    }));
    return _compileWithThemes.apply(this, arguments);
  }

  it('base',
  /*#__PURE__*/
  _asyncToGenerator(
  /*#__PURE__*/
  _regeneratorRuntime.mark(function _callee2() {
    var themesFile, preprocessor;
    return _regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            themesFile = require.resolve('./src/styles/scss/themes.scss');
            preprocessor = themesPreprocess(themesFile, basePreprocess(basePreprocessOptions), {
              debug: {
                showComponentsIds: true
              }
            });
            _context2.next = 4;
            return preprocess('scss', null, preprocessor);

          case 4:
            preprocessor = themesPreprocess(themesFile, {
              style: basePreprocess(basePreprocessOptions).style
            });
            _context2.next = 7;
            return preprocess('scss', null, preprocessor);

          case 7:
            assert.throws(function () {
              return themesPreprocess();
            }, Error);
            assert.throws(function () {
              return themesPreprocess('x', basePreprocess(basePreprocessOptions));
            }, Error);
            assert.throws(function () {
              return themesPreprocess('', basePreprocess(basePreprocessOptions));
            }, Error);
            assert.throws(function () {
              return themesPreprocess(themesFile);
            }, Error);
            assert.throws(function () {
              return themesPreprocess(themesFile, {});
            }, Error);
            assert.throws(function () {
              return themesPreprocess(themesFile, {
                style: 'x'
              });
            }, Error); // eslint-disable-next-line no-empty-function

            themesPreprocess(themesFile, {
              style: function style() {}
            });

          case 14:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  })));
  var cssLangs = ['scss', 'less', 'stylus', 'jss', 'jss'];
  var componentTypes = ['js', 'scss', 'no-style', 'css', 'less', 'stylus']; // const cssLangs = ['scss']
  // const componentTypes = ['less']

  it('preprocess',
  /*#__PURE__*/
  _asyncToGenerator(
  /*#__PURE__*/
  _regeneratorRuntime.mark(function _callee4() {
    return _regeneratorRuntime.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            this.timeout(60000);
            _context4.next = 3;
            return Promise.all(cssLangs.flatMap(function (lang) {
              return componentTypes.map(
              /*#__PURE__*/
              function () {
                var _ref4 = _asyncToGenerator(
                /*#__PURE__*/
                _regeneratorRuntime.mark(function _callee3(componentType) {
                  var compiled;
                  return _regeneratorRuntime.wrap(function _callee3$(_context3) {
                    while (1) {
                      switch (_context3.prev = _context3.next) {
                        case 0:
                          _context3.next = 2;
                          return compileWithThemes(componentType, lang);

                        case 2:
                          compiled = _context3.sent;
                          console.log(componentType, lang);
                          assert.ok(compiled.css.code);
                          assert.include(compiled.css.code, '.theme_dark h1');
                          assert.include(compiled.css.code, '.theme_light h1');
                          assert.match(compiled.css.code, new RegExp("component:\\s*[\"'][^\"']*component-".concat(componentType, "[\"']")));

                          if (componentType === 'no-style') {
                            assert.match(compiled.css.code, /^\.theme_/);
                            assert.notMatch(compiled.css.code, /component-type/);
                          } else {
                            assert.match(compiled.css.code, /^h1\b/);
                            assert.match(compiled.css.code, new RegExp("component-type:\\s*[\"']".concat(componentType, "[\"']")));
                          }

                        case 9:
                        case "end":
                          return _context3.stop();
                      }
                    }
                  }, _callee3);
                }));

                return function (_x4) {
                  return _ref4.apply(this, arguments);
                };
              }());
            }));

          case 3:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4, this);
  })));
});