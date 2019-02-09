/* eslint-disable no-new-func */
it('isNode', function () {
  // see: https://stackoverflow.com/a/31090240/5221762
  var isBrowser = new Function('try {return this===window;}catch(e){ return false;}');
  console.log("isBrowser = ".concat(isBrowser(), ";"));
  assert.strictEqual(isBrowser(), false);
});