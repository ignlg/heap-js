import Heap from '../src/Heap';

const someValues = [3, 15, 2, 300, 16, 4, 1, 8, 50, 21, 58, 7, 4, 9, 78, 88];
const otherValues = [12, 1, 2, 30, 116, 42, 12, 18, 1, 1, 1, 1];

describe('Heap instances', function () {
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

      describe('#bottom(N)', function () {
        it('should return an empty array for an empty heap', function () {
          expect(heap.bottom()).toEqual([]);
          expect(heap.bottom(10)).toEqual([]);
        });
        it('should return an empty array for invalid N', function () {
          heap.init(someValues);
          expect(heap.bottom(0)).toEqual([]);
          expect(heap.bottom(-10)).toEqual([]);
        });
        it('should return the peek for an one-element heap', function () {
          heap.push(1);
          expect(heap.bottom()).toEqual([1]);
          expect(heap.bottom(10)).toEqual([1]);
        });
        it('should return the lowest value N (<= length) elements of the heap', function () {
          heap.init(someValues.concat(someValues));
          const bottom = heap.toArray().slice(0);
          bottom.sort(heap._invertedCompare);
          for (const slice of [1, 6, someValues.length, someValues.length + 100]) {
            const b = heap.bottom(slice);
            b.sort(heap._invertedCompare);
            expect(b).toEqual(bottom.slice(0, slice));
          }
        });
        it('should return the lowest element of the heap if no N', function () {
          heap.init(someValues.concat(someValues));
          expect(heap.bottom()).toEqual(heap.bottom(1));
        });
      });

      describe('#check()', function () {
        it('should check if the heap is sorted', function () {
          heap.init(someValues);
          expect(heap.check()).not.toBeDefined();
          // Change comparison function to fail check
          heap.compare = (a, b) => 1;
          expect(heap.check()).toBeDefined();
        });
      });

      describe('#clear()', function () {
        it('should clear the heap', function () {
          heap.init(someValues);
          heap.clear();
          expect(heap.length).toEqual(0);
          expect(heap.toArray()).toEqual([]);
        });
      });

      describe('#clone()', function () {
        it('should clone the heap to a new one', function () {
          heap.init(someValues);
          const cloned = heap.clone();
          expect(cloned.length).toEqual(heap.length);
          expect(heap.heapArray).not.toBe(cloned.heapArray);
          expect(cloned.heapArray).toEqual(heap.heapArray);
          expect(cloned.compare(2, 5)).toEqual(heap.compare(2, 5));
          expect(cloned.limit).toEqual(heap.limit);
        });
      });

      describe('#comparator()', function () {
        it('should return the comparison function', function () {
          const fn = heap.comparator();
          expect(typeof fn).toBe('function');
          expect(heap.compare).toEqual(fn);
        });
      });

      describe('#contains(element)', function () {
        it('should find an element in the heap', function () {
          heap.init(someValues);
          expect(heap.contains(someValues[5])).toBe(true);
        });
        it('should not find an element not in the heap', function () {
          heap.init(someValues);
          expect(heap.contains(5000)).toBe(false);
        });
      });

      describe('#contains(element, fn)', function () {
        it('should find an element in the heap', function () {
          heap.init(someValues);
          expect(heap.contains(someValues[5], (el, o) => el > o)).toBe(true);
        });
        it('should not find an element not in the heap', function () {
          heap.init(someValues);
          expect(heap.contains(1, (el, o) => el < o)).toBe(false);
        });
      });

      describe('#get(index)', function () {
        it('should return the element', function () {
          heap.init(someValues);
          expect(heap.get(0)).toEqual(heap.peek());
          expect(heap.get(5)).toEqual(heap.heapArray[5]);
        });
      });

      describe('#getChildrenOf(index)', function () {
        it('should return the parent element', function () {
          heap.init(someValues);
          expect(heap.getChildrenOf(heap.length - 1)).toEqual([]);
          expect(heap.getChildrenOf(5)).toEqual(Heap.getChildrenIndexOf(5).map(heap.get.bind(heap)));
        });
      });

      describe('#getParentOf(index)', function () {
        it('should return the parent element', function () {
          heap.init(someValues);
          expect(heap.getParentOf(0)).toBeUndefined();
          expect(heap.getParentOf(5)).toBe(heap.get(2));
        });
      });

      describe('#init()', function () {
        it('should initialize a new heap', function () {
          heap.init(someValues);
          heap.init(otherValues);
          expect(heap.length).toEqual(otherValues.length);
        });
        it('should balance the heap', function () {
          heap.heapArray = someValues.slice(0);
          heap.init();
          expect(heap.length).toEqual(someValues.length);
          expect(heap.check()).not.toBeDefined();
        });
      });

      describe('#isEmpty()', function () {
        it('should return if heap is empty', function () {
          const filledHeap = factory();
          filledHeap.add(someValues[0]);
          expect(heap.isEmpty()).toBe(true);
          expect(filledHeap.isEmpty()).toBe(false);
        });
      });

      describe('#leafs()', function () {
        it('should return an empty array for an empty heap', function () {
          expect(heap.leafs()).toEqual([]);
        });
        it('should return the peek in a heap size one', function () {
          heap.init([1]);
          expect(heap.leafs()).toEqual([1]);
        });
        it('should return all the nodes without children', function () {
          heap.init(someValues);
          expect(heap.leafs()).toEqual(heap.toArray().slice(-8));
          heap.init(otherValues);
          expect(heap.leafs()).toEqual(heap.toArray().slice(-6));
        });
      });

      describe('#lenght / size()', function () {
        it('should return the heap length', function () {
          expect(heap.length).toEqual(0);
          expect(heap.size()).toEqual(0);
          heap.init(someValues);
          expect(heap.length).toEqual(someValues.length);
          expect(heap.size()).toEqual(someValues.length);
        });
      });

      describe('#limit', function () {
        it('should limit the heap length', function () {
          heap.init(someValues);
          expect(heap.length).toEqual(someValues.length);
          heap.limit = 5;
          expect(heap.limit).toEqual(5);
          expect(heap.length).toEqual(5);
          heap.push(...otherValues);
          expect(heap.length).toEqual(5);
          expect(heap.check()).not.toBeDefined();
        });
      });

      describe('#peek()', function () {
        it('should return the top element of the heap', function () {
          const min = Math.min(...someValues);
          const max = Math.max(...someValues);
          const peek = heap.compare(min, max) < 0 ? min : max;
          heap.init(someValues);
          expect(heap.peek()).toEqual(peek);
        });
      });

      describe('#pop() / poll', function () {
        it('should return undefined if heap is empty', function () {
          expect(heap.pop()).toBeUndefined();
        });
        it('should extract the peek if length is 1', function () {
          heap.init([999]);
          expect(heap.pop()).toBe(999);
          expect(heap.length).toBe(0);
        });
        it('should extract the element at the top, and keep the heap sorted', function () {
          heap.init(someValues);
          const peek = heap.peek();
          const len = heap.length;
          expect(heap.pop()).toEqual(peek);
          expect(heap.length).toEqual(len - 1);
          expect(heap.check()).not.toBeDefined();
        });
      });

      describe('#push() / add, offer, addAll', function () {
        it('should add one element to the heap, sorted', function () {
          const len = heap.length;
          someValues.forEach((el) => heap.push(el));
          expect(heap.length).toEqual(len + someValues.length);
          expect(heap.check()).not.toBeDefined();
        });
        it('should add many elements to the heap, sorted', function () {
          heap.init(someValues);
          const len = heap.length;
          heap.push(...otherValues);
          expect(heap.length).toEqual(len + otherValues.length);
          expect(heap.check()).not.toBeDefined();
        });
        it('should ignore empty calls', function () {
          heap.push(...someValues);
          const len = heap.length;
          expect(heap.push()).toBe(false);
          expect(heap.length).toEqual(len);
        });
      });

      describe('#pushpop(element)', function () {
        it('should push a below-peek and pop the peek, and keep the heap sorted', function () {
          heap.init(someValues);
          const peek = heap.peek() as number;
          const len = heap.length;
          const above = heap.compare(peek, peek + 1);
          const next = peek + (above > 0 ? -1 : 1);
          expect(heap.pushpop(next)).toEqual(peek);
          expect(heap.length).toEqual(len);
          expect(heap.check()).not.toBeDefined();
        });
        it('should push an above-peek and pop the peek, and keep the heap sorted', function () {
          heap.init(someValues);
          const peek = heap.peek() as number;
          const len = heap.length;
          const below = heap.compare(peek, peek + 1);
          const next = peek - (below > 0 ? -1 : 1);
          expect(heap.pushpop(next)).toEqual(next);
          expect(heap.length).toEqual(len);
          expect(heap.check()).not.toBeDefined();
        });
      });

      describe('#remove()', function () {
        it('should skip an empty heap', function () {
          expect(heap.remove()).toBe(false);
        });
        it('should skip if no element matches', function () {
          heap.init(someValues);
          const len = heap.length;
          expect(heap.remove(50000)).toBe(false);
          expect(heap.length).toBe(len);
        });
        it('should remove the peek if it matches and length is 1', function () {
          heap.init([999]);
          expect(heap.remove(999)).toBe(true);
          expect(heap.length).toBe(0);
        });
        it('should remove the leaf if it matches the end', function () {
          heap.init(someValues);
          const len = heap.length;
          const bottom = heap.heapArray[heap.length - 1];
          expect(heap.remove(bottom)).toBe(true);
          expect(heap.heapArray[heap.length - 1]).not.toBe(bottom);
          expect(heap.length).toBe(len - 1);
          expect(heap.check()).not.toBeDefined();
        });
        it('should remove the element from the heap, and keep the heap sorted', function () {
          heap.init(someValues);
          const len = heap.length;
          expect(heap.remove(someValues[3])).toBe(true);
          expect(heap.remove(someValues[4])).toBe(true);
          expect(heap.length).toBe(len - 2);
          expect(heap.check()).not.toBeDefined();
        });
        it('whithout element, should remove the peek', function () {
          heap.init(someValues);
          const peek = heap.peek();
          const len = heap.length;
          expect(heap.remove()).toBe(true);
          expect(heap.peek()).not.toBe(peek);
          expect(heap.length).toBe(len - 1);
          expect(heap.check()).not.toBeDefined();
        });
        it('with comparison function, should remove custom match element', function () {
          heap.init(someValues);
          const len = heap.length;
          // Custom function that matches latest value, ignoring 999
          expect(heap.remove(999, (el, o) => el === someValues[someValues.length - 1])).toBe(true);
          expect(heap.length).toBe(len - 1);
          expect(heap.check()).not.toBeDefined();
        });
      });

      describe('#replace(element)', function () {
        it('should put the element at the top, and then sort it', function () {
          heap.init(someValues);
          const len = heap.length;
          const peek = heap.peek();
          expect(heap.replace(3000)).toEqual(peek);
          expect(heap.length).toEqual(len);
          expect(heap.contains(3000)).toBe(true);
          expect(heap.check()).not.toBeDefined();
        });
      });

      describe('#top(N)', function () {
        it('should return an empty array for an empty heap', function () {
          expect(heap.top()).toEqual([]);
          expect(heap.top(10)).toEqual([]);
        });
        it('should return an empty array for invalid N', function () {
          heap.init(someValues);
          expect(heap.top(0)).toEqual([]);
          expect(heap.top(-10)).toEqual([]);
        });
        it('should return the top N (<= length) elements of the heap', function () {
          heap.init(someValues.concat(someValues));
          const top = heap.toArray().slice(0);
          top.sort(heap.comparator());
          for (const slice of [1, 6, someValues.length, someValues.length + 100]) {
            const topValues = heap.top(slice);
            topValues.sort(heap.compare);
            expect(topValues).toEqual(top.slice(0, slice));
          }
        });
        it('should return the top element of the heap if no N', function () {
          heap.init(someValues.concat(someValues));
          expect(heap.top()).toEqual(heap.top(1));
        });
      });

      describe('#toArray()', function () {
        it('should return an array', function () {
          heap.init(someValues);
          const arr = heap.toArray();
          expect(Array.isArray(arr)).toBe(true);
          expect(arr.length).toEqual(someValues.length);
          const clonedValues = someValues.slice(0);
          clonedValues.sort(heap.comparator());
          arr.sort(heap.comparator());
          expect(arr).toEqual(clonedValues);
        });
      });

      describe('#toString()', function () {
        it('should return an string', function () {
          heap.init(someValues);
          expect(heap.toString().length).toEqual(someValues.toString().length);
        });
      });

      describe('is Iterable', function () {
        it('should be iterable via for...of', function () {
          heap.init(someValues.concat(someValues));
          const top = heap.toArray().slice(0);
          top.sort(heap.comparator());
          const result = [];
          for (const value of heap) {
            result.push(value);
          }
          expect(result).toEqual(top);
        });
      });
      describe('#iterator()', function () {
        it('returns an iterable', function () {
          heap.init(someValues.concat(someValues));
          const top = heap.toArray().slice(0);
          top.sort(heap.comparator());
          const result = [];
          for (const value of heap.iterator()) {
            result.push(value);
          }
          expect(result).toEqual(top);
        });
      });
    });
  });
});
