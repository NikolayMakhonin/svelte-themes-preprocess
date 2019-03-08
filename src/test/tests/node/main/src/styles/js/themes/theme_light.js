export default componentId => ({
	':global(.theme_light)': {
		h1: {
			color       : '#bbb',
			'-component': `"${componentId}"`
		}
	}
})
