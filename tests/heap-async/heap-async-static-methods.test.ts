import HeapAsync from '../../src/HeapAsync';
import { equalUnsortedArrays, someValues } from '../test-helpers';

describe('HeapAsync class', function () {
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
    it('should output a pretty print', async function () {
      const heap = new HeapAsync();
      await heap.init(someValues);
      const printed = HeapAsync.print(heap);
      const values = [...someValues];
      while (values.length) {
        expect(printed).toContain(String(values.pop()));
      }
    });
  });
  describe('#heapify', function () {
    it('should return a heap from an array', async function () {
      const heapArr = [...someValues];
      await HeapAsync.heapify(heapArr);
      expect(Array.isArray(heapArr)).toBe(true);
      expect(heapArr.length).toEqual(someValues.length);

      const checkHeap = new HeapAsync<number>();
      checkHeap.heapArray = [...heapArr];
      expect(await checkHeap.check()).not.toBeDefined();
    });
  });
  describe('#heappush', function () {
    it('should push an element to the array as a heap', async function () {
      const heapArr = [...someValues];
      await HeapAsync.heapify(heapArr);
      await HeapAsync.heappush(heapArr, 30000);
      expect(Array.isArray(heapArr)).toBe(true);
      expect(heapArr.length).toEqual(someValues.length + 1);

      const checkHeap = new HeapAsync<number>();
      checkHeap.heapArray = [...heapArr];
      expect(await checkHeap.check()).not.toBeDefined();
      expect(await checkHeap.contains(30000)).toBe(true);
    });
  });
  describe('#heappop', function () {
    it('should pop the peek of the array as a heap', async function () {
      const heapArr = [...someValues];
      await HeapAsync.heapify(heapArr);
      const peek = (await HeapAsync.heappop(heapArr)) as number;
      expect(Array.isArray(heapArr)).toBe(true);
      expect(heapArr.length).toEqual(someValues.length - 1);
      expect(Math.min(peek, ...heapArr)).toEqual(peek);

      const checkHeap = new HeapAsync<number>();
      checkHeap.heapArray = [...heapArr];
      expect(await checkHeap.check()).not.toBeDefined();
    });
  });
  describe('#heappushpop', function () {
    it('should push and pop as a heap', async function () {
      const heapArr = [...someValues];
      await HeapAsync.heapify(heapArr);

      let peek = await HeapAsync.heappushpop(heapArr, -1);
      expect(Array.isArray(heapArr)).toBe(true);
      expect(heapArr.length).toEqual(someValues.length);
      expect(peek).toEqual(-1);

      peek = await HeapAsync.heappushpop(heapArr, 1);
      expect(heapArr.length).toEqual(someValues.length);
      expect(peek).toBeLessThanOrEqual(Math.min(...heapArr));

      peek = await HeapAsync.heappushpop(heapArr, 500);
      expect(heapArr.length).toEqual(someValues.length);
      expect(peek).toBeLessThan(500);

      const checkHeap = new HeapAsync<number>();
      checkHeap.heapArray = [...heapArr];
      expect(await checkHeap.check()).not.toBeDefined();
    });
  });
  describe('#heapreplace', function () {
    it('should pop and push as a heap', async function () {
      const heapArr = [...someValues];
      await HeapAsync.heapify(heapArr);

      let _in = -1;
      let peek = await HeapAsync.heapreplace(heapArr, _in);
      expect(Array.isArray(heapArr)).toBe(true);
      expect(heapArr.length).toBe(someValues.length);
      expect(peek).toBe(Math.min(...someValues));
      expect(heapArr[0]).toBe(_in);
      expect(heapArr[0]).toBeLessThanOrEqual(Math.min(...heapArr));

      _in = 1;
      peek = await HeapAsync.heapreplace(heapArr, _in);
      expect(heapArr.length).toEqual(someValues.length);
      expect(peek).toBe(-1);
      expect(heapArr[0]).toBe(_in);
      expect(heapArr[0]).toBeLessThanOrEqual(Math.min(...heapArr));

      _in = 500;
      peek = await HeapAsync.heapreplace(heapArr, _in);
      expect(heapArr.length).toEqual(someValues.length);
      expect(peek).toBeLessThan(_in);
      expect(heapArr[0]).not.toBe(_in);
      expect(heapArr[0]).toBeLessThanOrEqual(Math.min(...heapArr));

      const checkHeap = new HeapAsync<number>();
      checkHeap.heapArray = [...heapArr];
      expect(await checkHeap.check()).not.toBeDefined();
    });
  });
  describe('#heaptop', function () {
    describe('should return the most valuable elements', function () {
      const arr = [12, 1, 3, 41, 51, 16, 7];
      let heapArr: number[] = arr.slice(0);
      beforeEach(async function () {
        await HeapAsync.heapify(heapArr);
      });
      it('should return 1 element', async function () {
        expect(await HeapAsync.heaptop(heapArr, 1)).toEqual([Math.min(...arr)]);
      });
      it(`should return ${Math.floor(arr.length / 2)} elements`, async function () {
        const top = await HeapAsync.heaptop(heapArr, 3);
        equalUnsortedArrays(top, [1, 3, 7]);
      });
      it('should return all elements', async function () {
        const top = await HeapAsync.heaptop(heapArr, 4);
        equalUnsortedArrays(top, [1, 3, 7, 12]);
      });
      it('should return 1 element by default', async function () {
        expect(await HeapAsync.heaptop(heapArr)).toEqual(await HeapAsync.heaptop(heapArr, 1));
      });
    });
  });
  describe('#heapbottom', function () {
    describe('returns the least valuable elements', function () {
      const arr = [1, 12, 3, 41, 51, 16, 7];
      let heapArr: number[] = arr.slice(0);
      beforeEach(async function () {
        await HeapAsync.heapify(heapArr);
      });
      it('should return 1 element', async function () {
        expect(await HeapAsync.heapbottom(heapArr, 1)).toEqual([Math.max(...arr)]);
      });
      it(`should return ${Math.floor(arr.length / 2)} elements`, async function () {
        const top = await HeapAsync.heapbottom(heapArr, 3);
        equalUnsortedArrays(top, [51, 41, 16]);
      });
      it('should return all the elements', async function () {
        const top = await HeapAsync.heapbottom(heapArr, arr.length);
        equalUnsortedArrays(top, [1, 12, 3, 41, 51, 16, 7]);
      });
      it('should return one element by default', async function () {
        expect(await HeapAsync.heapbottom(heapArr)).toEqual(await HeapAsync.heapbottom(heapArr, 1));
      });
    });
  });
  describe('#nlargest', function () {
    describe('returns the n most valuable elements', function () {
      const arr = [1, 12, 3, 41, 51, 16, 7];
      // One
      it('should return 1 element', async function () {
        expect(await HeapAsync.nlargest(1, arr)).toEqual([1]);
      });
      // Half
      it(`should return ${Math.floor(arr.length / 2)} elements`, async function () {
        const half = await HeapAsync.nlargest(Math.floor(arr.length / 2), arr);
        equalUnsortedArrays(half, [1, 3, 7]);
      });
      // Full
      it('should return all the elements', async function () {
        const full = await HeapAsync.nlargest(arr.length, arr);
        equalUnsortedArrays(full, [51, 41, 16, 12, 7, 3, 1]);
      });
    });
  });
  describe('#nsmallest', function () {
    describe('returns the n least valuable elements', function () {
      const arr = [1, 12, 3, 41, 51, 16, 7];
      it('should return 1 element', async function () {
        expect(await HeapAsync.nsmallest(1, arr)).toEqual([51]);
      });
      it(`should return ${Math.floor(arr.length / 2)} elements`, async function () {
        const half = await HeapAsync.nsmallest(arr.length / 2, arr);
        equalUnsortedArrays(half, [51, 41, 16]);
      });
      it('should return all the elements', async function () {
        const full = await HeapAsync.nsmallest(arr.length, arr);
        equalUnsortedArrays(full, [1, 3, 7, 12, 16, 41, 51]);
      });
    });
  });
});
