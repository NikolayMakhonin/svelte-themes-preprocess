const params = {color: '#bbb'}
module.exports = componentId => ({
	':global(.theme_dark)': {
		h1: {
			color       : params?.color,
			'-component': `"${componentId}"`
		}
	}
})
