import { customMax, customMin } from './test-helpers';

describe('Test helpers', function () {
  describe('#customMax()', function () {
    it('should return the max element', function () {
      const values = [
        [0, 1],
        [3, 2],
        [1, 10],
      ];
      expect(customMax(...values)).toBe(values[2]);
    });
  });
  describe('#customMin()', function () {
    it('should return the min element', function () {});
    const values = [
      [0, 1],
      [3, 2],
      [1, 0],
    ];
    expect(customMin(...values)).toBe(values[2]);
  });
});
