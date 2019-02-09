import helpers from './helpers/helpers';
export function main(args) {
  console.log(JSON.stringify(args), helpers.test);
}
export default {
  main: main
};