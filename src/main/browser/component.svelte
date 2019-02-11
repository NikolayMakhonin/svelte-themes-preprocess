<p>Count: {{count}}</p>
<button on:click='set({ count: count + 1 })'>+1</button>

<!-- Default data -->
<script>
	import {test} from './test'

	export default {
		data() {
			return {
				count: test ? test.length : test,
			}
		}
	}
</script>
