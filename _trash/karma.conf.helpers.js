/* eslint-disable prefer-template,no-sync,no-process-env */
// Karma configuration

const globby = require('globby')
const path = require('path')
const fs = require('fs')
const thisPackage = require('./package')

module.exports.mergeArrays = mergeArrays
function mergeArrays(...arrays) {
	const items = []
	const arraysLength = arrays.length
	for (let i = 0; i < arraysLength; i++) {
		const array = arrays[i]
		const len = array ? array.length : 0
		for (let j = 0; j < len; j++) {
			const item = array[j]
			if (items.indexOf(item) < 0) {
				items.push(item)
			}
		}
	}
	return items
}

module.exports.writeTextFile = writeTextFile
function writeTextFile(outFilePath, text) {
	const dir = path.dirname(outFilePath)

	if (!fs.existsSync(dir)) {
		fs.mkdirSync(dir, {recursive: true})
	}

	fs.writeFileSync(outFilePath, text)

	return outFilePath
}

module.exports.concatJsFiles = function concatJsFiles(outFilePath, ...globbyPatterns) {
	const dir = path.dirname(outFilePath)

	const code = globby
		.sync(globbyPatterns)
		.map(file => "import {} from '"
			+ path
				.relative(dir, file)
				.replace(/\\/g, '/')
				.replace(/'/g, "\\'")
			+ "'")
		.join('\n') + '\n'

	return writeTextFile(outFilePath, code)
}

module.exports.servedPattern = servedPattern
function servedPattern(file) {
	return {
		pattern : file,
		included: true,
		served  : true,
		watched : false
	}
}

module.exports.watchPatterns = function (...globbyPatterns) {
	return globby
		.sync(globbyPatterns)
		.map(file => ({
			pattern : file,
			included: false,
			served  : false,
			watched : true
		}))
}

module.exports.configCommon = function (config) {
	function polyfill(files) {
		files.unshift(...[
			servedPattern(writeTextFile(
				path.resolve('./tmp/karma/polyfill_before.js'),
				"'use strict'; \n"
				+ '(function () {\n'
				// + "\tif (typeof _babelPolyfill !== 'undefined') return;\n"
				+ '\tvar log = [];\n'
				+ "\tif (typeof describe !== 'undefined') {\n"
				+ "\t\tlog.push('describe: ' + describe);\n"
				+ '\t}\n'
				+ "\tif (typeof it !== 'undefined') {\n"
				+ "\t\tlog.push('it: ' + it);\n"
				+ '\t}\n'
				+ "\tif (typeof test !== 'undefined') {\n"
				+ "\t\tlog.push('test: ' + test);\n"
				+ '\t}\n'
				+ '\tif (log.length) {\n'
				+ "\t\tthrow new Error('polyfill was not run first:\\n' + log.join('\\n'));\n"
				+ '\t}\n'
				+ "\tconsole.log('karma polyfill activating...');\n"
				+ '})();\n'
			)),
			servedPattern(require.resolve('babel-polyfill/dist/polyfill')),
			servedPattern(writeTextFile(
				path.resolve('./tmp/karma/polyfill_after.js'),
				"console.log('karma polyfill activated!');"
			))
		])
	}
	polyfill.$inject = ['config.files']

	config.set({
		// base path that will be used to resolve all patterns (eg. files, exclude)
		basePath: '',

		// frameworks to use
		// available frameworks: https://npmjs.org/browse/keyword/karma-adapter
		frameworks: ['mocha', 'polyfill'],

		logReporter: {
			outputPath: 'reports/', // default name is current directory
			outputName: 'performance.log' // default name is logFile_month_day_year_hr:min:sec.log
		},

		plugins: [
			'karma-chrome-launcher',
			'karma-mocha',
			'karma-rollup-preprocessor',
			'karma-coverage',
			{
				'framework:polyfill': ['factory', polyfill]
			},
		],

		// optionally, configure the reporter
		coverageReporter: {
			type  : 'lcov',
			dir   : '.nyc_output',
			subDir: () => 'browser'
		},

		// web server port
		port: 9876,

		// enable / disable colors in the output (reporters and logs)
		colors: true,

		// level of logging
		// possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
		logLevel: config.LOG_INFO,

		// start these browsers
		// available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
		browsers: ['Chrome'],

		customLaunchers: {
			ChromeHeadlessNoSandbox: {
				base : 'ChromeHeadless',
				flags: ['--no-sandbox']
			},
			FirefoxHeadless: {
				base : 'Firefox',
				flags: ['-headless'],
			}
		}
	})

	if (process.env.TRAVIS) {
		config.browsers = [
			'ChromeHeadlessNoSandbox',
			'FirefoxHeadless',
			// 'IE',
			'Opera',
			'PhantomJS'
		]
	}
}

module.exports.configDetectBrowsers = configDetectBrowsers
function configDetectBrowsers(config) {
	config.set({
		// frameworks to use
		// available frameworks: https://npmjs.org/browse/keyword/karma-adapter
		frameworks: mergeArrays(config.frameworks, ['detectBrowsers']),

		// configuration
		detectBrowsers: {
			// use headless mode, for browsers that support it, default is false
			preferHeadless: true,
		},

		plugins: mergeArrays(config.plugins, [
			'karma-chrome-launcher',
			'karma-edge-launcher',
			'karma-firefox-launcher',
			'karma-ie-launcher',
			'karma-safari-launcher',
			'karma-safaritechpreview-launcher',
			'karma-opera-launcher',
			'karma-phantomjs-launcher',
			'karma-detect-browsers'
		])
	})
}

module.exports.configTravisBrowsers = function (config) {
	configDetectBrowsers(config)
}

module.exports.configBrowserStack = function (config) {
	// const IntellijReporter = require('L:\\Program Files\\JetBrains\\WebStorm 2018.3\\plugins\\js-karma\\js_reporter\\karma-intellij\\lib\\intellijReporter.js')

	const customLaunchers = {
		// config: https://www.browserstack.com/list-of-browsers-and-platforms?product=automate
		// browser statistics: http://gs.statcounter.com/browser-version-market-share
		Android4_4: {
			base      : 'BrowserStack',
			browser   : 'android',
			os        : 'android',
			device    : 'Samsung Galaxy Tab 4',
			os_version: '4.4',
			realMobile: true
		},
		Android6: {
			base      : 'BrowserStack',
			browser   : 'android',
			os        : 'android',
			device    : 'Samsung Galaxy S7',
			os_version: '6.0',
			realMobile: true
		},
		// Android7: {
		// 	base      : 'BrowserStack',
		// 	browser   : 'android',
		// 	os        : 'android',
		// 	device    : 'Samsung Galaxy S8',
		// 	os_version: '7.0',
		// 	realMobile: true
		// },
		// Android8: {
		// 	base      : 'BrowserStack',
		// 	browser   : 'android',
		// 	os        : 'android',
		// 	device    : 'Samsung Galaxy S9',
		// 	os_version: '8.0',
		// 	realMobile: true
		// },
		iOS10_3: {
			base      : 'BrowserStack',
			browser   : 'iOS',
			os        : 'iOS',
			device    : 'iPhone 7',
			os_version: '10.3',
			realMobile: true
		},
		iOS11: {
			base      : 'BrowserStack',
			browser   : 'iOS',
			os        : 'iOS',
			device    : 'iPhone 8',
			os_version: '11.0',
			realMobile: true
		},
		iOS12: {
			base      : 'BrowserStack',
			browser   : 'iOS',
			os        : 'iOS',
			device    : 'iPhone XS',
			os_version: '12.1',
			realMobile: true
		},
		Chrome48: {
			base           : 'BrowserStack',
			browser        : 'Chrome',
			browser_version: '48',
			os             : 'Windows',
			os_version     : '10',
		},
		Firefox47: {
			base           : 'BrowserStack',
			browser        : 'Firefox',
			browser_version: '47',
			os             : 'Windows',
			os_version     : '10',
		},
		Safari10_1: {
			base           : 'BrowserStack',
			browser        : 'Safari',
			browser_version: '10.1',
			os             : 'OS X',
			os_version     : 'Sierra',
		},
		Opera12_15: {
			base           : 'BrowserStack',
			browser        : 'Opera',
			browser_version: '12.15',
			os             : 'OS X',
			os_version     : 'Sierra',
		},
		IE11: {
			base           : 'BrowserStack',
			browser        : 'IE',
			browser_version: '11',
			os             : 'Windows',
			os_version     : '10',
		},
		IE10: {
			base           : 'BrowserStack',
			browser        : 'IE',
			browser_version: '10',
			os             : 'Windows',
			os_version     : '8',
		},
		IE9: {
			base           : 'BrowserStack',
			browser        : 'IE',
			browser_version: '9',
			os             : 'Windows',
			os_version     : '7',
		},
		Edge: {
			base           : 'BrowserStack',
			browser        : 'Edge',
			browser_version: '15',
			os             : 'Windows',
			os_version     : '10',
		},
		Yandex: {
			base           : 'BrowserStack',
			browser        : 'Yandex',
			browser_version: '14.12',
			os             : 'Windows',
			os_version     : '10',
		}
	}

	const id = new Date().getTime().toString(36)
	// see: https://github.com/karma-runner/karma-browserstack-launcher#global-options
	const browserStack = {
		build  	 : 'Local - ' + id,
		name   	 : 'Local',
		// localIdentifier: id,
		// tunnelIdentifier: id,
		project  : thisPackage.name,
		username : process.env.BROWSERSTACK_USERNAME.replace(/-travis$/, ''),
		accessKey: process.env.BROWSERSTACK_ACCESS_KEY,
		video    : false
	}

	if (process.env.TRAVIS) {
		delete browserStack.build
		delete browserStack.name
	}

	// if (process.env.TRAVIS) {
	// 	browserStack.name = process.env.TRAVIS_JOB_NUMBER
	// 	browserStack.build = 'TRAVIS #' + process.env.TRAVIS_BUILD_NUMBER + ' (' + process.env.TRAVIS_BUILD_ID + ')'
	// 	browserStack.tunnelIdentifier = process.env.BROWSERSTACK_LOCAL_IDENTIFIER
	// 	browserStack.startTunnel = false
	// }
	// function killBrowsersAfterComplete(launcher, capturedBrowsers, executor, done) {
	// 	this.on('browser_complete_with_no_more_retries', function (completedBrowser) {
	// 		//singleRunDoneBrowsers[completedBrowser.id] = true
	//
	// 		if (launcher.kill(completedBrowser.id)) {
	// 			// workaround to supress "disconnect" warning
	// 			completedBrowser.state = Browser.STATE_DISCONNECTED
	// 		}
	//
	// 		emitRunCompleteIfAllBrowsersDone()
	// 	})
	// }
	// killBrowsersAfterComplete.$inject = ['launcher', 'capturedBrowsers', 'executor', 'done']

	config.set({
		captureTimeout: 300000,

		browserStack,

		customLaunchers,

		browsers: mergeArrays(config.browsers, Object.keys(customLaunchers).slice(0, 10)), // DEBUG
		// browsers: concatArrays(config.browsers, Object.keys(customLaunchers)),

		plugins: mergeArrays(config.plugins, [
			'karma-browserstack-launcher',
			// {
			// 	'framework:killBrowsersAfterComplete': ['factory', killBrowsersAfterComplete]
			// }
		]),

		browserConsoleLogOptions: {
			level   : 'debug',
			terminal: true
		},

		logLevel: config.LOG_DEBUG
	})

	fixBrowserStackWebStormProblems(config)
}

function fixBrowserStackWebStormProblems(config) {
	// Do not allow WebStorm to disable singleRun

	delete config.singleRun
	Object.defineProperty(config, 'singleRun', {
		value   : true,
		writable: false
	})

	// Disable 2 lines in browser.execute function:
	// (see file karma/lib/browser.js)
	// execute (config) {
	// 	DISABLE: this.activeSockets.forEach((socket) => socket.emit('execute', config))
	// 	DISABLE: this.setState(CONFIGURING)
	// 	this.refreshNoActivityTimeout()
	// }

	// eslint-disable-next-line global-require
	const Browser = require('karma/lib/browser')

	// You should not not change variable names and comments. This is needed for injects.
	Browser.factory = function (
		id, fullName, /* capturedBrowsers */ collection, emitter, socket, timer,
		/* config.browserDisconnectTimeout */ disconnectDelay,
		/* config.browserNoActivityTimeout */ noActivityTimeout
	) {
		const browser = new Browser(id, fullName, collection, emitter, socket, timer, disconnectDelay, noActivityTimeout)

		if (browser.execute) {
			browser.execute = function () {
				this.refreshNoActivityTimeout()
			}
			console.log('Fix BrowserStack WebStorm problems')
		}
		return browser
	}
}
