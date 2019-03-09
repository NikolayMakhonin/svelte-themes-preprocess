const params = {color: '#bbb'}
export default componentId => ({
	':global(.theme_dark)': {
		h1: {
			color       : params?.color,
			'-component': `"${componentId}"`
		}
	}
})
