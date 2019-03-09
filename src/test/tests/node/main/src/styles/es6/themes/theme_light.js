const params = {color: '#bbb'}
module.exports = componentId => ({
	':global(.theme_light)': {
		h1: {
			color       : params?.color,
			'-component': `"${componentId}"`
		}
	}
})
