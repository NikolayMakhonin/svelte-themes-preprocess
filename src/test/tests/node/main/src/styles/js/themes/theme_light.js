const params = {color: '#bbb'}
export default componentId => ({
	':global(.theme_light)': {
		h1: {
			color       : params?.color,
			'-component': `"${componentId}"`
		}
	}
})
