<h1>Svelte component: scss</h1>

<style type="text/scss">
	$componentType: 'scss';

	h1 {
		color: #aaa;
		component-type: $componentType;
	}

	:global {
		main, a {
			div, table, .xxx, &-wer {
				content: "global";
			}
		}
	}
</style>
