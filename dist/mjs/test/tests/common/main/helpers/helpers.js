import helpers from '../../../../../main/common/helpers/helpers';
describe('common > main > helpers > helpers', function () {
  it('base', function () {
    assert.strictEqual(helpers.test, 'test');
  });
});