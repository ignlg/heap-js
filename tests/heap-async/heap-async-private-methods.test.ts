import HeapAsync from '../../src/HeapAsync';
import { someValues } from '../test-helpers';

describe('Heap private', function () {
  const heaps = [
    {
      type: 'min heap (default)',
      factory: () => new HeapAsync<any>(),
    },
    {
      type: 'max heap',
      factory: () => new HeapAsync<any>(HeapAsync.maxComparator),
    },
    {
      type: 'min number heap',
      factory: () => new HeapAsync<number>(HeapAsync.minComparatorNumber),
    },
    {
      type: 'max number heap',
      factory: () => new HeapAsync<number>(HeapAsync.maxComparatorNumber),
    },
  ];

  heaps.forEach((heapInstance) => {
    const { type, factory } = heapInstance;
    let heap: HeapAsync<number>;
    describe(type, function () {
      beforeEach(function () {
        heap = factory();
      });

      describe('#_moveNode(i, j)', function () {
        it('should switch elements', async function () {
          await heap.init(someValues);
          const iv = heap.get(2);
          const jv = heap.get(5);
          heap._moveNode(2, 5);
          expect(iv).not.toBe(jv);
          expect(heap.get(5)).toEqual(iv);
          expect(heap.get(2)).toEqual(jv);
        });
      });

      describe('#_sortNodeUp(i)', function () {
        it('should move the element up the hierarchy', async function () {
          const arr = [3, 2, 1];
          // TODO: reverse order
          heap.heapArray = arr.slice(0);
          // move it
          await heap._sortNodeUp(2);
          expect(heap.heapArray[0]).toEqual(arr[2]);
          expect(heap.heapArray[2]).toEqual(arr[0]);
          // do not move it
          await heap._sortNodeUp(2);
          expect(arr.slice(0, 2)).not.toContain(heap.heapArray[0]);
          expect(arr.slice(0, 2)).toContain(heap.heapArray[2]);
        });
      });

      describe('#_sortNodeDown(i)', function () {
        it('should move the element down the hierarchy', async function () {
          const arr = [3, 2, 1];
          // TODO: reverse order
          heap.heapArray = arr.slice(0);
          // move it
          await heap._sortNodeDown(0);
          expect(heap.heapArray[2]).toEqual(arr[0]);
          expect(heap.heapArray[0]).toEqual(arr[2]);
          // do not move it
          await heap._sortNodeDown(0);
          expect(arr.slice(0, 2)).not.toContain(heap.heapArray[0]);
          expect(arr.slice(0, 2)).toContain(heap.heapArray[2]);
        });
      });

      describe('#_topN(N)', function () {
        it('should return the top N (<= length) elements of the heap', async function () {
          await heap.init(someValues);
          const top = heap.toArray().slice(0);
          for (const slice of [1, 6, 12, someValues.length]) {
            const topN = await heap._topN_push(slice);
            expect(topN).toEqual(top.slice(0, slice));
          }
        });
      });
      describe('#_topLeafN(N)', function () {
        for (const slice of [1, 6, 12, someValues.length]) {
          it(`should return the top N (<= length) elements of the heap (N == ${slice})`, async function () {
            await heap.init(someValues);
            const top = heap.toArray().slice(0);
            const topN = await heap._topN_fill(slice);
            expect(topN).toEqual(top.slice(0, slice));
          });
        }
      });
      describe('#_topHeapN(N)', function () {
        for (const slice of [1, 6, 12, someValues.length]) {
          it(`should return the top N (<= length) elements of the heap (N == ${slice})`, async function () {
            await heap.init(someValues);
            const top = heap.toArray().slice(0);
            expect(await heap._topN_heap(slice)).toEqual(top.slice(0, slice));
          });
        }
      });
      describe('#_bottomN(N)', function () {
        for (const slice of [1, 6, 12, someValues.length]) {
          it(`should return the bottom N (<= length) elements of the heap (N == ${slice})`, async function () {
            await heap.init(someValues);
            const bottom = heap.toArray().slice(0);
            const bottomN = await heap._bottomN_push(slice);
            expect(bottomN).toEqual(bottom.slice(0, slice));
          });
        }
      });
      describe('#_topOf(...list)', function () {
        it('should return the top element of the list', async function () {
          await heap.init(someValues);
          const top = heap.toArray().slice(0);
          expect(await heap._topOf(top[0])).toEqual(top[0]);
          expect(await heap._topOf(...someValues)).toEqual(top[0]);
        });
      });
      describe('#_topIdxOf(array)', function () {
        it('should return -1 on empty array', async function () {
          expect(await heap._topIdxOf([])).toEqual(-1);
        });
        it('should return the index of the top element of the list', async function () {
          await heap.init(someValues);
          const top = heap.toArray().slice(0);
          expect(await heap._topIdxOf(top.slice(0, 1))).toEqual(0);
          expect(await heap._topIdxOf(top)).toEqual(0);
          top.push(top.shift() as number);
          expect(await heap._topIdxOf(top)).toEqual(top.length - 1);
          const mid = Math.floor(top.length / 2);
          top.splice(mid, 0, top.pop() as number);
          expect(await heap._topIdxOf(top)).toEqual(mid);
        });
      });
    });
  });
});
