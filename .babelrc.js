module.exports = {
  "presets": [
    ["@babel/preset-env"]
  ],
  "plugins": [
    "@babel/plugin-transform-runtime",
    "@babel/plugin-syntax-dynamic-import",
    "@babel/plugin-proposal-optional-chaining",
    "@babel/plugin-proposal-throw-expressions",
	
    ["@babel/plugin-proposal-class-properties", { "loose": true }],
    "@babel/plugin-transform-parameters",
    "@babel/plugin-transform-async-to-generator"
  ]
}