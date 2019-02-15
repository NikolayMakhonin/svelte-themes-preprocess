"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var svelte = _interopRequireWildcard(require("svelte"));

var _fs = _interopRequireDefault(require("fs"));

var _main = _interopRequireDefault(require("../../../../main/node/main"));

var _sveltePreprocess = _interopRequireDefault(require("svelte-preprocess"));

var _postcssImport = _interopRequireDefault(require("postcss-import"));

require("core-js/fn/array/flat-map");

describe('node > main > main', function () {
  function getComponentPath(type) {
    return require.resolve(`./src/components/component-${type}.svelte`);
  }

  function getFileContent(filePath) {
    return _fs.default.readFileSync(filePath, 'utf-8');
  }

  const preprocessOptionsDefault = {};

  function preprocess(componentType, content, options = {}) {
    const filename = getComponentPath(componentType);

    if (!content) {
      content = getFileContent(filename);
    }

    return svelte.preprocess(content, { ...preprocessOptionsDefault,
      filename,
      ...options
    });
  }

  const compileOptionsDefault = {
    dev: true,
    css: true,
    generate: true,
    hydratable: true,
    emitCss: true,

    onerror(err) {
      assert.fail(err.message);
    },

    onwarn(warn) {
      assert.fail(warn.message);
    }

  };

  function compile(componentType, content, options = {}) {
    const filename = getComponentPath(componentType);

    if (!content) {
      content = getFileContent(filename);
    }

    try {
      return svelte.compile(content, { ...compileOptionsDefault,
        filename,
        ...options
      });
    } catch (ex) {
      console.error('Error compile svelte:\r\n', content, ex);
      assert.fail();
      return null;
    }
  }

  it('svelte', function () {
    let result = compile('no-style');
    assert.notOk(result.css.code);
    result = compile('css');
    assert.ok(result.css.code);
  });
  const basePreprocessOptions = {
    scss: true,
    less: true,
    stylus: true,
    postcss: {
      // see: https://github.com/postcss/postcss
      plugins: [(0, _postcssImport.default)()]
    }
  };

  async function compileWithThemes(componentType, lang) {
    const fileExt = lang === 'stylus' ? 'styl' : lang;

    const themesFile = require.resolve(`./src/styles/${lang}/themes.${fileExt}`);

    const content = (await preprocess(componentType, null, (0, _main.default)(themesFile, (0, _sveltePreprocess.default)(basePreprocessOptions).style, (0, _sveltePreprocess.default)(basePreprocessOptions), {
      lang
    }))).toString();
    return compile(componentType, content, {});
  }

  const cssLangs = ['scss', 'less', 'stylus'];
  const componentTypes = ['no-style', 'css', 'scss', 'less', 'stylus']; // const cssLangs = ['scss']
  // const componentTypes = ['less']

  it('preprocess', async function () {
    this.timeout(60000);
    await Promise.all(cssLangs.flatMap(lang => componentTypes.map(async componentType => {
      const compiled = await compileWithThemes(componentType, lang);
      console.log(componentType, lang);
      assert.ok(compiled.css.code);
      assert.include(compiled.css.code, '.theme_dark h1');
      assert.include(compiled.css.code, '.theme_light h1');
      assert.match(compiled.css.code, new RegExp(`component:\\s*["'][^"']*component-${componentType}["']`));

      if (componentType === 'no-style') {
        assert.match(compiled.css.code, /^\.theme_/);
        assert.notMatch(compiled.css.code, /component-type/);
      } else {
        assert.match(compiled.css.code, /^h1\b/);
        assert.match(compiled.css.code, new RegExp(`component-type:\\s*["']${componentType}["']`));
      }
    })));
  });
});