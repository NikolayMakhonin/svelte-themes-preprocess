import test from './test'
import yargs from 'yargs'

// see http://yargs.js.org/docs/
const args = yargs().argv

console.log(JSON.stringify(args))

export default {
	args
}
