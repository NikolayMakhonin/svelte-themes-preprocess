<h1>Svelte component: css</h1>

<style type="text/js">
const params = { color: '#aaa' }
module.exports = {
	h1: {
		color: params?.color,
		'component-type': '"js"'
	}
}
</style>
