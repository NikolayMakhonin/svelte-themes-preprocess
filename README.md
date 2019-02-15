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

For quickly create NodeJs helpers module using these commands (just copy/paste it to the console):

(Create new clear empty repository before)

Config:

```cmd
(
SET TEMPLATE_BRANCH=helpers
SET TEMPLATE_REPO=https://github.com/NikolayMakhonin/nodejs-templates.git
SET /p DIR_NAME=Enter project directory name:
SET /p YOUR_REPO_URL=Enter your new clear repository url:
)
 
```

Install:

```cmd
git clone --origin template --branch %TEMPLATE_BRANCH% %TEMPLATE_REPO% %DIR_NAME%
cd %DIR_NAME%
git branch -m %TEMPLATE_BRANCH% master
git tag -a -m "New project from template \"%TEMPLATE_BRANCH%\"" v0.0.0
git remote set-url --push template no_push
git remote add origin %YOUR_REPO_URL%
git checkout -b develop
git push --all origin
git push --tags origin
git branch -u origin/develop develop
git branch -u origin/master master
 
```

Or you can just clone repository without history using this command:
```bash
npx degit NikolayMakhonin/nodejs-templates#helpers <app name> && cd <app name> && npm i && npm run test
```

# License

[CC0-1.0](LICENSE)

[npm-image]: https://img.shields.io/npm/v/templates.svg
[npm-url]: https://npmjs.org/package/templates
[node-version-image]: https://img.shields.io/node/v/templates.svg
[node-version-url]: https://nodejs.org/en/download/
[travis-image]: https://travis-ci.org/NikolayMakhonin/nodejs-templates.svg?branch=helpers
[travis-url]: https://travis-ci.org/NikolayMakhonin/nodejs-templates?branch=helpers
[coveralls-image]: https://coveralls.io/repos/github/NikolayMakhonin/nodejs-templates/badge.svg?branch=helpers
[coveralls-url]: https://coveralls.io/github/NikolayMakhonin/nodejs-templates?branch=helpers
[downloads-image]: https://img.shields.io/npm/dm/templates.svg
[downloads-url]: https://npmjs.org/package/templates
[npm-url]: https://npmjs.org/package/templates
