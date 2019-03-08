"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var svelte = _interopRequireWildcard(require("svelte"));

var _fs = _interopRequireDefault(require("fs"));

var _main = _interopRequireDefault(require("../../../../main/node/main"));

var _sveltePreprocess = _interopRequireDefault(require("svelte-preprocess"));

var _postcssImport = _interopRequireDefault(require("postcss-import"));

var _postcssGlobalNested = _interopRequireDefault(require("postcss-global-nested"));

var _postcssJsSyntax = _interopRequireDefault(require("postcss-js-syntax"));

var _requireFromMemory = require("require-from-memory");

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
    transformers: {
      scss: true,
      less: true,
      stylus: true,

      javascript({
        content,
        filename
      }) {
        // console.log('qweqwe', content, filename)
        const parsed = _postcssJsSyntax.default.parse(content, {
          from: filename,
          requireFromString: _requireFromMemory.requireFromString
        });

        console.log(parsed);
        return parsed;
      },

      postcss: {
        // see: https://github.com/postcss/postcss
        plugins: [(0, _postcssImport.default)(), (0, _postcssGlobalNested.default)()]
      }
    }
  };

  async function compileWithThemes(componentType, lang) {
    const fileExt = lang === 'stylus' ? 'styl' : lang;

    const themesFile = require.resolve(`./src/styles/${lang}/themes.${fileExt}`);

    const content = (await preprocess(componentType, null, (0, _main.default)(themesFile, (0, _sveltePreprocess.default)(basePreprocessOptions), {
      lang
    }))).toString();
    return compile(componentType, content, {});
  }

  it('base', async () => {
    const themesFile = require.resolve('./src/styles/scss/themes.scss');

    let preprocessor = (0, _main.default)(themesFile, (0, _sveltePreprocess.default)(basePreprocessOptions), {
      debug: {
        showComponentsIds: true
      }
    });
    await preprocess('scss', null, preprocessor);
    preprocessor = (0, _main.default)(themesFile, {
      style: (0, _sveltePreprocess.default)(basePreprocessOptions).style
    });
    await preprocess('scss', null, preprocessor);
    assert.throws(() => (0, _main.default)(), Error);
    assert.throws(() => (0, _main.default)('x', (0, _sveltePreprocess.default)(basePreprocessOptions)), Error);
    assert.throws(() => (0, _main.default)('', (0, _sveltePreprocess.default)(basePreprocessOptions)), Error);
    assert.throws(() => (0, _main.default)(themesFile), Error);
    assert.throws(() => (0, _main.default)(themesFile, {}), Error);
    assert.throws(() => (0, _main.default)(themesFile, {
      style: 'x'
    }), Error); // eslint-disable-next-line no-empty-function

    (0, _main.default)(themesFile, {
      style() {}

    });
  });
  const cssLangs = ['scss', 'less', 'stylus'];
  const componentTypes = ['js', 'scss', 'no-style', 'css', 'less', 'stylus']; // const cssLangs = ['scss']
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