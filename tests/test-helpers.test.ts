import { customBottom, customTop } from './test-helpers';

describe('Test helpers', function () {
  describe('#customBottom()', function () {
    it('should return the bottom element', function () {
      const values = [
        [0, 1],
        [3, 2],
        [1, 10],
      ];
      expect(customBottom(...values)).toBe(values[2]);
    });
  });
  describe('#customTop()', function () {
    it('should return the top element', function () {});
    const values = [
      [0, 1],
      [3, 2],
      [1, 0],
    ];
    expect(customTop(...values)).toBe(values[2]);
  });
});
