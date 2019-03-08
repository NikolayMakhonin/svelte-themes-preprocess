export default componentId => ({
	':global(.theme_dark)': {
		h1: {
			color       : '#bbb',
			'-component': `"${componentId}"`
		}
	}
})
