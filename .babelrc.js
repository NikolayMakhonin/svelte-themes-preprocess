module.exports = {
	"presets": [
		[
			"@babel/preset-env",
			{
				"targets": {
					"node": "8.6.0"
				}
			}
		]
	],
	"plugins": [
		"@babel/plugin-syntax-dynamic-import",
		"@babel/plugin-proposal-optional-chaining",
		"@babel/plugin-proposal-throw-expressions"
	]
}
