import _regeneratorRuntime from "@babel/runtime/regenerator";
import _asyncToGenerator from "@babel/runtime/helpers/asyncToGenerator";
import _objectSpread from "@babel/runtime/helpers/objectSpread";
import * as svelte from 'svelte';
import fs from 'fs';
import themePreprocess from '../../../../main/node/main';
import basePreprocess from 'svelte-preprocess';
import postcssImport from 'postcss-import';
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
    onerror: function onerror(err) {
      assert.fail(err.message);
    },
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
  var basePreprocessOptions = {
    scss: true,
    less: true,
    stylus: true,
    postcss: {
      // see: https://github.com/postcss/postcss
      plugins: [postcssImport()]
    }
  };

  function compileWithThemes(_x, _x2) {
    return _compileWithThemes.apply(this, arguments);
  }

  function _compileWithThemes() {
    _compileWithThemes = _asyncToGenerator(
    /*#__PURE__*/
    _regeneratorRuntime.mark(function _callee3(componentType, lang) {
      var fileExt, themesFile, content;
      return _regeneratorRuntime.wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              fileExt = lang === 'stylus' ? 'styl' : lang;
              themesFile = require.resolve("./src/styles/".concat(lang, "/themes.").concat(fileExt));
              _context3.next = 4;
              return preprocess(componentType, null, themePreprocess(themesFile, basePreprocess(basePreprocessOptions).style, basePreprocess(basePreprocessOptions), {
                lang: lang
              }));

            case 4:
              content = _context3.sent.toString();
              return _context3.abrupt("return", compile(componentType, content, {}));

            case 6:
            case "end":
              return _context3.stop();
          }
        }
      }, _callee3, this);
    }));
    return _compileWithThemes.apply(this, arguments);
  }

  var cssLangs = ['scss', 'less', 'stylus'];
  var componentTypes = ['no-style', 'css', 'scss', 'less', 'stylus']; // const cssLangs = ['scss']
  // const componentTypes = ['less']

  it('preprocess',
  /*#__PURE__*/
  _asyncToGenerator(
  /*#__PURE__*/
  _regeneratorRuntime.mark(function _callee2() {
    return _regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            this.timeout(60000);
            _context2.next = 3;
            return Promise.all(cssLangs.flatMap(function (lang) {
              return componentTypes.map(
              /*#__PURE__*/
              function () {
                var _ref2 = _asyncToGenerator(
                /*#__PURE__*/
                _regeneratorRuntime.mark(function _callee(componentType) {
                  var compiled;
                  return _regeneratorRuntime.wrap(function _callee$(_context) {
                    while (1) {
                      switch (_context.prev = _context.next) {
                        case 0:
                          _context.next = 2;
                          return compileWithThemes(componentType, lang);

                        case 2:
                          compiled = _context.sent;
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
                          return _context.stop();
                      }
                    }
                  }, _callee, this);
                }));

                return function (_x3) {
                  return _ref2.apply(this, arguments);
                };
              }());
            }));

          case 3:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, this);
  })));
});