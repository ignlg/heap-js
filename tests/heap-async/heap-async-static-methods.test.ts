import HeapAsync from '../../src/HeapAsync';
import { someValues } from '../test-helpers';

describe('Heap class', function () {
  describe('#getParentIndexOf()', function () {
    it('should return parent for every children', function () {
      let p;
      for (let i = 100; i > 0; --i) {
        p = (i - 2 + (i % 2)) / 2;
        expect(HeapAsync.getParentIndexOf(i)).toEqual(p);
      }
    });
    it('should return -1 for index <= 0', function () {
      expect(HeapAsync.getParentIndexOf(0)).toEqual(-1);
      expect(HeapAsync.getParentIndexOf(-100)).toEqual(-1);
    });
  });
  describe('#getChildrenIndexOf()', function () {
    it('should return children for every index', function () {
      let c;
      for (let i = 100; i >= 0; --i) {
        c = [i * 2 + 1, i * 2 + 2];
        expect(HeapAsync.getChildrenIndexOf(i)).toEqual(c);
      }
    });
  });
  describe('#getSiblingIndexOf()', function () {
    it('should return sibling index', function () {
      expect(HeapAsync.getSiblingIndexOf(0)).toEqual(-1);
      expect(HeapAsync.getSiblingIndexOf(1)).toEqual(2);
      expect(HeapAsync.getSiblingIndexOf(2)).toEqual(1);
      expect(HeapAsync.getSiblingIndexOf(20)).toEqual(19);
      expect(HeapAsync.getSiblingIndexOf(11)).toEqual(12);
    });
  });
  describe('#print()', function () {
    it('should output a pretty print', function () {
      const heap = new HeapAsync();
      heap.init(someValues);
      const printed = HeapAsync.print(heap);
      const values = [...someValues];
      while (values.length) {
        expect(printed).toContain(String(values.pop()));
      }
    });
  });
  describe('#heapify', function () {
    it('should return a heap from an array', function () {
      const heapArr = [...someValues];
      HeapAsync.heapify(heapArr);
      expect(Array.isArray(heapArr)).toBe(true);
      expect(heapArr.length).toEqual(someValues.length);

      const checkHeap = new HeapAsync<number>();
      checkHeap.heapArray = [...heapArr];
      expect(checkHeap.check()).not.toBeDefined();
    });
  });
  describe('#heappush', function () {
    it('should push an element to the array as a heap', function () {
      const heapArr = [...someValues];
      HeapAsync.heapify(heapArr);
      HeapAsync.heappush(heapArr, 30000);
      expect(Array.isArray(heapArr)).toBe(true);
      expect(heapArr.length).toEqual(someValues.length + 1);

      const checkHeap = new HeapAsync<number>();
      checkHeap.heapArray = [...heapArr];
      expect(checkHeap.check()).not.toBeDefined();
      expect(checkHeap.contains(30000)).toBe(true);
    });
  });
  describe('#heappop', function () {
    it('should pop the peek of the array as a heap', function () {
      const heapArr = [...someValues];
      HeapAsync.heapify(heapArr);
      const peek = HeapAsync.heappop(heapArr) as number;
      expect(Array.isArray(heapArr)).toBe(true);
      expect(heapArr.length).toEqual(someValues.length - 1);
      expect(Math.min(peek, ...heapArr)).toEqual(peek);

      const checkHeap = new HeapAsync<number>();
      checkHeap.heapArray = [...heapArr];
      expect(checkHeap.check()).not.toBeDefined();
    });
  });
  describe('#heappushpop', function () {
    it('should push and pop as a heap', function () {
      const heapArr = [...someValues];
      HeapAsync.heapify(heapArr);

      let peek = HeapAsync.heappushpop(heapArr, -1);
      expect(Array.isArray(heapArr)).toBe(true);
      expect(heapArr.length).toEqual(someValues.length);
      expect(peek).toEqual(-1);

      peek = HeapAsync.heappushpop(heapArr, 1);
      expect(heapArr.length).toEqual(someValues.length);
      expect(peek).toBeLessThanOrEqual(Math.min(...heapArr));

      peek = HeapAsync.heappushpop(heapArr, 500);
      expect(heapArr.length).toEqual(someValues.length);
      expect(peek).toBeLessThan(500);

      const checkHeap = new HeapAsync<number>();
      checkHeap.heapArray = [...heapArr];
      expect(checkHeap.check()).not.toBeDefined();
    });
  });
  describe('#heapreplace', function () {
    it('should pop and push as a heap', function () {
      const heapArr = [...someValues];
      HeapAsync.heapify(heapArr);

      let _in = -1;
      let peek = HeapAsync.heapreplace(heapArr, _in);
      expect(Array.isArray(heapArr)).toBe(true);
      expect(heapArr.length).toBe(someValues.length);
      expect(peek).toBe(Math.min(...someValues));
      expect(heapArr[0]).toBe(_in);
      expect(heapArr[0]).toBeLessThanOrEqual(Math.min(...heapArr));

      _in = 1;
      peek = HeapAsync.heapreplace(heapArr, _in);
      expect(heapArr.length).toEqual(someValues.length);
      expect(peek).toBe(-1);
      expect(heapArr[0]).toBe(_in);
      expect(heapArr[0]).toBeLessThanOrEqual(Math.min(...heapArr));

      _in = 500;
      peek = HeapAsync.heapreplace(heapArr, _in);
      expect(heapArr.length).toEqual(someValues.length);
      expect(peek).toBeLessThan(_in);
      expect(heapArr[0]).not.toBe(_in);
      expect(heapArr[0]).toBeLessThanOrEqual(Math.min(...heapArr));

      const checkHeap = new HeapAsync<number>();
      checkHeap.heapArray = [...heapArr];
      expect(checkHeap.check()).not.toBeDefined();
    });
  });
  describe('#heaptop', function () {
    it('should return the most valuable elements', function () {
      const arr = [1, 12, 3, 41, 51, 16, 7];
      HeapAsync.heapify(arr);
      expect(HeapAsync.heaptop(arr, 1)).toEqual([Math.min(...arr)]);
      {
        const top = HeapAsync.heaptop(arr, 3);
        top.sort(HeapAsync.minComparatorNumber);
        expect(top).toEqual([1, 3, 7]);
      }
      {
        const top = HeapAsync.heaptop(arr, 4);
        top.sort(HeapAsync.minComparatorNumber);
        expect(top).toEqual([1, 3, 7, 12]);
      }
      expect(HeapAsync.heaptop(arr)).toEqual(HeapAsync.heaptop(arr, 1));
    });
  });
  describe('#heapbottom', function () {
    it('should return the least valuable elements', function () {
      const arr = [1, 12, 3, 41, 51, 16, 7];
      HeapAsync.heapify(arr);
      expect(HeapAsync.heapbottom(arr, 1)).toEqual([Math.max(...arr)]);
      {
        const top = HeapAsync.heapbottom(arr, 3);
        top.sort(HeapAsync.maxComparatorNumber);
        expect(top).toEqual([51, 41, 16]);
      }
      {
        const top = HeapAsync.heapbottom(arr, 4);
        top.sort(HeapAsync.maxComparatorNumber);
        expect(top).toEqual([51, 41, 16, 12]);
      }

      expect(HeapAsync.heapbottom(arr)).toEqual(HeapAsync.heapbottom(arr, 1));
    });
  });
  describe('#nlargest', function () {
    it('should return the n most valuable elements', function () {
      const arr = [1, 12, 3, 41, 51, 16, 7];
      const sortedArr = [...arr];
      sortedArr.sort(HeapAsync.minComparatorNumber);
      // One
      expect(HeapAsync.nlargest(1, arr)).toEqual(sortedArr.slice(0, 1));
      // Half
      const half = HeapAsync.nlargest(Math.floor(arr.length / 2), arr);
      half.sort(HeapAsync.minComparatorNumber);
      expect(half).toEqual(sortedArr.slice(0, arr.length / 2));
      // Full
      const full = HeapAsync.nlargest(arr.length, arr);
      full.sort(HeapAsync.minComparatorNumber);
      expect(full).toEqual(sortedArr);
    });
  });
  describe('#nsmallest', function () {
    it('should return the n least valuable elements', function () {
      const arr = [1, 12, 3, 41, 51, 16, 7];
      const sortedArr = [...arr];
      sortedArr.sort(HeapAsync.minComparatorNumber);
      expect(HeapAsync.nsmallest(1, arr)).toEqual([Math.max(...arr)]);
      const half = HeapAsync.nsmallest(arr.length / 2, arr);
      half.sort(HeapAsync.minComparatorNumber);
      expect(half).toEqual(sortedArr.slice(arr.length / 2 + 1));
      const full = HeapAsync.nlargest(arr.length, arr);
      full.sort(HeapAsync.minComparatorNumber);
      expect(full).toEqual(sortedArr);
    });
  });
});
