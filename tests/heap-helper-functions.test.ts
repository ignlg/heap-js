import { toInt } from '../src/Heap';

describe('Heap helper functions', function () {
  describe('#toInt(n)', function () {
    it('should return an integer', function () {
      expect(toInt(0.5)).toEqual(0);
      expect(toInt(0.8)).toEqual(0);
      expect(toInt(1.8)).toEqual(1);
      expect(toInt(18.0)).toEqual(18);
      expect(toInt(18.9)).toEqual(18);
    });
  });
});
