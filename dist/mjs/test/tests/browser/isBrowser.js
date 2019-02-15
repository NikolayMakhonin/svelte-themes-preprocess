/* eslint-disable no-new-func */
describe('browser', function () {
  it('isBrowser', function () {
    // see: https://stackoverflow.com/a/31090240/5221762
    var isBrowser = new Function('try {return this===window;}catch(e){ return false;}');
    console.log("".concat(new Date(), " isBrowser = ").concat(isBrowser(), ";"));
    assert.strictEqual(isBrowser(), true);
  });
});