import Heap from '../src/Heap';

const someValues = [3, 15, 2, 300, 16, 4, 1, 8, 50, 21, 58, 7, 4, 9, 78, 88];
const otherValues = [12, 1, 2, 30, 116, 42, 12, 18, 1, 1, 1, 1];

describe('Heap private', function () {
  const heaps = [
    {
      type: 'min heap (default)',
      factory: () => new Heap<any>(),
    },
    {
      type: 'max heap',
      factory: () => new Heap<any>(Heap.maxComparator),
    },
    {
      type: 'min number heap',
      factory: () => new Heap<number>(Heap.minComparatorNumber),
    },
    {
      type: 'max number heap',
      factory: () => new Heap<number>(Heap.maxComparatorNumber),
    },
  ];

  heaps.forEach((heapInstance) => {
    const { type, factory } = heapInstance;
    let heap: Heap<number>;
    describe(type, function () {
      beforeEach(function () {
        heap = factory();
      });

      describe('#_moveNode(i, j)', function () {
        it('should switch elements', function () {
          heap.init(someValues);
          const iv = heap.get(2);
          const jv = heap.get(5);
          heap._moveNode(2, 5);
          expect(iv).not.toBe(jv);
          expect(heap.get(5)).toEqual(iv);
          expect(heap.get(2)).toEqual(jv);
        });
      });

      describe('#_sortNodeUp(i)', function () {
        it('should move the element up the hierarchy', function () {
          const arr = [3, 2, 1];
          arr.sort((a, b) => heap.comparator()(a, b) * -1);
          heap.heapArray = arr.slice(0);
          // move it
          heap._sortNodeUp(2);
          expect(heap.heapArray[0]).toEqual(arr[2]);
          expect(heap.heapArray[2]).toEqual(arr[0]);
          // do not move it
          heap._sortNodeUp(2);
          expect(arr.slice(0, 2)).not.toContain(heap.heapArray[0]);
          expect(arr.slice(0, 2)).toContain(heap.heapArray[2]);
        });
      });

      describe('#_sortNodeDown(i)', function () {
        it('should move the element down the hierarchy', function () {
          const arr = [3, 2, 1];
          // reverse order
          arr.sort((a, b) => heap.comparator()(a, b) * -1);
          heap.heapArray = arr.slice(0);
          // move it
          heap._sortNodeDown(0);
          expect(heap.heapArray[2]).toEqual(arr[0]);
          expect(heap.heapArray[0]).toEqual(arr[2]);
          // do not move it
          heap._sortNodeDown(0);
          expect(arr.slice(0, 2)).not.toContain(heap.heapArray[0]);
          expect(arr.slice(0, 2)).toContain(heap.heapArray[2]);
        });
      });

      describe('#_topN(N)', function () {
        it('should return the top N (<= length) elements of the heap', function () {
          heap.init(someValues);
          const top = heap.toArray().slice(0);
          top.sort(heap.compare);
          for (const slice of [1, 6, 12, someValues.length]) {
            const topN = heap._topN_push(slice);
            topN.sort(heap.compare);
            expect(topN).toEqual(top.slice(0, slice));
          }
        });
      });
      describe('#_topLeafN(N)', function () {
        for (const slice of [1, 6, 12, someValues.length]) {
          it(`should return the top N (<= length) elements of the heap (N == ${slice})`, function () {
            heap.init(someValues);
            const top = heap.toArray().slice(0);
            top.sort(heap.compare);
            const topN = heap._topN_fill(slice);
            topN.sort(heap.compare);
            expect(topN).toEqual(top.slice(0, slice));
          });
        }
      });
      describe('#_topHeapN(N)', function () {
        for (const slice of [1, 6, 12, someValues.length]) {
          it(`should return the top N (<= length) elements of the heap (N == ${slice})`, function () {
            heap.init(someValues);
            const top = heap.toArray().slice(0);
            top.sort(heap.compare);
            expect(heap._topN_heap(slice)).toEqual(top.slice(0, slice));
          });
        }
      });
      describe('#_bottomN(N)', function () {
        for (const slice of [1, 6, 12, someValues.length]) {
          it(`should return the bottom N (<= length) elements of the heap (N == ${slice})`, function () {
            heap.init(someValues);
            const bottom = heap.toArray().slice(0);
            bottom.sort(heap._invertedCompare);
            const bottomN = heap._bottomN_push(slice);
            bottomN.sort(heap._invertedCompare);
            expect(bottomN).toEqual(bottom.slice(0, slice));
          });
        }
      });
      describe('#_topOf(...list)', function () {
        it('should return the top element of the list', function () {
          heap.init(someValues);
          const top = heap.toArray().slice(0);
          top.sort(heap.comparator());
          expect(heap._topOf(top[0])).toEqual(top[0]);
          expect(heap._topOf(...someValues)).toEqual(top[0]);
        });
      });
      describe('#_topIdxOf(array)', function () {
        it('should return -1 on empty array', function () {
          expect(heap._topIdxOf([])).toEqual(-1);
        });
        it('should return the index of the top element of the list', function () {
          heap.init(someValues);
          const top = heap.toArray().slice(0);
          top.sort(heap.comparator());
          expect(heap._topIdxOf(top.slice(0, 1))).toEqual(0);
          expect(heap._topIdxOf(top)).toEqual(0);
          top.push(top.shift() as number);
          expect(heap._topIdxOf(top)).toEqual(top.length - 1);
          const mid = Math.floor(top.length / 2);
          top.splice(mid, 0, top.pop() as number);
          expect(heap._topIdxOf(top)).toEqual(mid);
        });
      });
    });
  });
});
