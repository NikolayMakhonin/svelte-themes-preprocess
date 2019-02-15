<!-- Markdown Docs: -->
<!-- https://guides.github.com/features/mastering-markdown/#GitHub-flavored-markdown -->
<!-- https://daringfireball.net/projects/markdown/basics -->
<!-- https://daringfireball.net/projects/markdown/syntax -->

<!-- [![NPM Version][npm-image]][npm-url] -->
<!-- [![NPM Downloads][downloads-image]][downloads-url] -->
<!-- [![Node.js Version][node-version-image]][node-version-url] -->
[![Build Status][travis-image]][travis-url]
[![Test Coverage][coveralls-image]][coveralls-url]

# Description

Add support flexible themes for svelte components.

You can use this plugin with rollup-plugin-svelte: ```svelte({ preprocessor: ... })```

Plugin support these CSS syntaxes: ```scss```, ```less```, ```stylus```

## Install

```
npm i postcss postcss-import node-sass svelte-preprocess svelte-themes-preprocess --save-dev
```

## How it work

**theme_dark.scss**
```scss
:global(.theme_dark) {
    @if ($component = 'module_name/src/components/Nav') {
        h1 {
            color: #111;
        }
    }
}
```

**theme_light.scss**
```scss
:global(.theme_light) {
    @if ($component = 'module_name/src/routes/index') {
        h1 {
            color: #222;
        }
    }
}
```

**themes.scss**
```
@import 'themes/theme_dark';
@import 'themes/theme_light';
```

**component.svelte**
```
<h1>Svelte component</h1>
<style>
    h1 {
        color: #000;
    }
</style>
```

**Preprocessing**
```
import preprocess from 'svelte-preprocess'
import postcssImport from 'postcss-import'
import themesPreprocess from 'svelte-themes-preprocess'

const postcssOptions = {
    plugins: [
        // This plugin is necessary and should be first in plugins list:
        postcssImport(),
        
        // Other plugins ...
    ]
}

const sveltePreprocess = preprocess({
    scss   : true,
    postcss: postcssOptions
})

const result = svelte.preprocess(input, themesPreprocess(
    path.resolve('./src/styles/themes.scss'),
    sveltePreprocess,
    {
        lang: 'scss'
    }
))
```
**Result**
```
<h1>Svelte component</h1>
<style>
    h1 {
        color: #000;
    }
    
    .theme_dark h1 {
        color: #111;
    }
    
    .theme_dark h1 {
        color: #222;
    }
</style>
```

# License

[CC0-1.0](LICENSE)

[npm-image]: https://img.shields.io/npm/v/svelte-themes-preprocess.svg
[npm-url]: https://npmjs.org/package/svelte-themes-preprocess
[node-version-image]: https://img.shields.io/node/v/svelte-themes-preprocess.svg
[node-version-url]: https://nodejs.org/en/download/
[travis-image]: https://travis-ci.org/NikolayMakhonin/svelte-themes-preprocess.svg
[travis-url]: https://travis-ci.org/NikolayMakhonin/svelte-themes-preprocess
[coveralls-image]: https://coveralls.io/repos/github/NikolayMakhonin/svelte-themes-preprocess/badge.svg
[coveralls-url]: https://coveralls.io/github/NikolayMakhonin/svelte-themes-preprocess
[downloads-image]: https://img.shields.io/npm/dm/svelte-themes-preprocess.svg
[downloads-url]: https://npmjs.org/package/svelte-themes-preprocess
[npm-url]: https://npmjs.org/package/svelte-themes-preprocess
