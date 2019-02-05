import helpers from './helpers'
import yargs from 'yargs'

export function main(argv) {
	// see http://yargs.js.org/docs/
	const args = yargs(argv).argv
	console.log(JSON.stringify(args))
}

export default {
	main
}
