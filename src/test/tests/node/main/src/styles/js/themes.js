/* eslint-disable global-require */
const dark = require('./themes/theme_dark.js')
const light = require('./themes/theme_light.js')?.default

module.exports = componentId => [
	...[dark(componentId)],
	light(componentId)
]
