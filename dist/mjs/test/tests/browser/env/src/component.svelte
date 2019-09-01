<svelte:options accessors/>

<p>Count: {count}</p>
<button on:click='{() => count++}'>+1</button>

<!-- Default data -->
<script>
	import {test} from './test'

	export let count = test ? test.length : test
</script>
