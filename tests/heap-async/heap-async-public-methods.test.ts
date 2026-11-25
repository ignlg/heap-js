import HeapAsync from '../../src/HeapAsync';
import { customBottom, customTop, customValues, equalUnsortedArrays, someValues } from '../test-helpers';

describe('HeapAsync instances', function () {
  const heaps = [
    {
      type: 'min heap (default)',
      factory: () => new HeapAsync<any>(),
      values: someValues,
      top: Math.min,
      bottom: Math.max,
    },
    {
      type: 'max heap',
      factory: () => new HeapAsync<any>(HeapAsync.maxComparator),
      values: someValues,
      top: Math.max,
      bottom: Math.min,
    },
    {
      type: 'min number heap',
      factory: () => new HeapAsync<any>(HeapAsync.minComparatorNumber),
      values: someValues,
      top: Math.min,
      bottom: Math.max,
    },
    {
      type: 'max number heap',
      factory: () => new HeapAsync<any>(HeapAsync.maxComparatorNumber),
      values: someValues,
      top: Math.max,
      bottom: Math.min,
    },
    {
      type: 'custom array heap',
      factory: () => new HeapAsync<any>(async (a, b) => a[1] - b[1]),
      values: customValues,
      top: customTop,
      bottom: customBottom,
    },
  ];

  describe.each(heaps)('heap types', (heapInstance) => {
    const { type, factory, values, top, bottom } = heapInstance;
    let heap = factory();
    describe(type, function () {
      beforeEach(function () {
        heap = factory();
      });

      describe('#bottom(N)', function () {
        it('should return an empty array for an empty heap', async function () {
          expect(await heap.bottom()).toEqual([]);
          expect(await heap.bottom(10)).toEqual([]);
        });
        it('should return an empty array for invalid N', async function () {
          await heap.init(values);
          expect(await heap.bottom(0)).toEqual([]);
          expect(await heap.bottom(-10)).toEqual([]);
        });
        it('should return the peek for an one-element heap', async function () {
          await heap.push(1);
          expect(await heap.bottom()).toEqual([1]);
          expect(await heap.bottom(10)).toEqual([1]);
        });
        it('should return the lowest value N (<= length) elements of the heap', async function () {
          await heap.init(values.concat(values));
          const bottomArr = heap.toArray().slice(0);
          bottomArr.sort((a, b) => (bottom(a, b) === a ? -1 : 1));
          for (const slice of [1, Math.floor(values.length / 2), values.length, values.length + 100]) {
            const b = await heap.bottom(slice);
            equalUnsortedArrays(b, bottomArr.slice(0, slice));
          }
        });
        it('should return the lowest element of the heap if no N', async function () {
          await heap.init(values.concat(values));
          expect(await heap.bottom()).toEqual(await heap.bottom(1));
        });
      });

      describe('#check()', function () {
        it('should check if the heap is sorted', async function () {
          await heap.init(values);
          expect(await heap.check()).not.toBeDefined();
          // Change comparison function to fail check
          heap.compare = async (a, b) => 1;
          expect(await heap.check()).toBeDefined();
        });
      });

      describe('#clear()', function () {
        it('should clear the heap', async function () {
          await heap.init(values);
          heap.clear();
          expect(heap.length).toEqual(0);
          expect(heap.toArray()).toEqual([]);
        });
      });

      describe('#clone()', function () {
        it('should clone the heap to a new one', async function () {
          await heap.init(values);
          const cloned = heap.clone();
          expect(cloned.length).toEqual(heap.length);
          expect(heap.heapArray).not.toBe(cloned.heapArray);
          expect(cloned.heapArray).toEqual(heap.heapArray);
          expect(await cloned.compare(2, 5)).toEqual(await heap.compare(2, 5));
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
        it('should find an element in the heap', async function () {
          await heap.init(values);
          expect(await heap.contains(values[5])).toBe(true);
        });
        it('should not find an element not in the heap', async function () {
          await heap.init(values);
          expect(await heap.contains(5000)).toBe(false);
        });
      });

      describe('#contains(element, fn)', function () {
        it('should find an element in the heap', async function () {
          await heap.init(values);
          expect(await heap.contains(values[5], async (el, o) => el > o)).toBe(true);
        });
        it('should not find an element not in the heap', async function () {
          await heap.init(values);
          expect(await heap.contains(1, async (el, o) => el < o)).toBe(false);
        });
      });

      describe('#get(index)', function () {
        it('should return the element', async function () {
          await heap.init(values);
          expect(heap.get(0)).toEqual(heap.peek());
          expect(heap.get(5)).toEqual(heap.heapArray[5]);
        });
      });

      describe('#getChildrenOf(index)', function () {
        it('should return children elements', async function () {
          await heap.init(values);
          expect(heap.getChildrenOf(heap.length - 1)).toEqual([]);
          expect(heap.getChildrenOf(5)).toEqual(HeapAsync.getChildrenIndexOf(5).map(heap.get.bind(heap)));
        });
      });

      describe('#getParentOf(index)', function () {
        it('should return the parent element', async function () {
          await heap.init(values);
          expect(heap.getParentOf(0)).toBeUndefined();
          expect(heap.getParentOf(5)).toBe(heap.get(2));
        });
      });

      describe('#init()', function () {
        it('should initialize a new heap', async function () {
          const otherValues = values.slice(0, Math.floor(values.length / 2));
          await heap.init(values);
          await heap.init(otherValues);
          equalUnsortedArrays(heap.toArray(), otherValues);
        });
        it('should balance the heap', async function () {
          heap.heapArray = values.slice(0);
          await heap.init();
          expect(heap.length).toEqual(values.length);
          expect(await heap.check()).not.toBeDefined();
        });
      });

      describe('#isEmpty()', function () {
        it('should return if heap is empty', async function () {
          const filledHeap = factory();
          await filledHeap.add(values[0]);
          expect(heap.isEmpty()).toBe(true);
          expect(filledHeap.isEmpty()).toBe(false);
        });
      });

      describe('#leafs()', function () {
        it('should return an empty array for an empty heap', function () {
          expect(heap.leafs()).toEqual([]);
        });
        it('should return the peek in a heap size one', async function () {
          await heap.init([1]);
          expect(heap.leafs()).toEqual([1]);
        });
        it('should return all the nodes without children', async function () {
          await heap.init(values);
          const pi = HeapAsync.getParentIndexOf(values.length - 1);
          expect(heap.leafs()).toEqual(heap.toArray().slice(pi + 1));

          const otherValues = values.slice(0, Math.floor(values.length / 2));
          const pio = HeapAsync.getParentIndexOf(otherValues.length - 1);
          await heap.init(otherValues);
          expect(heap.leafs()).toEqual(heap.toArray().slice(pio + 1));
        });
      });

      describe('#length / size()', function () {
        it('should return the heap length', async function () {
          expect(heap.length).toEqual(0);
          expect(heap.size()).toEqual(0);
          await heap.init(values);
          expect(heap.length).toEqual(values.length);
          expect(heap.size()).toEqual(values.length);
        });
      });

      describe('#limit', function () {
        it('should limit the heap length using setLimit', async function () {
          await heap.init(values);
          expect(heap.length).toEqual(values.length);
          await heap.setLimit(5);
          expect(heap.limit).toEqual(5);
          expect(heap.length).toEqual(5);
          const otherValues = values.slice(0, Math.floor(values.length / 2));
          await heap.push(...otherValues);
          expect(heap.length).toEqual(5);
          expect(await heap.check()).not.toBeDefined();
        });
      });

      describe('#limit keeps top N best values', function () {
        it('should keep the N smallest values for min-heap', async function () {
          const minHeap = new HeapAsync(HeapAsync.minComparatorNumber);
          await minHeap.setLimit(3);
          await minHeap.push(5, 1, 8, 2, 9, 3, 7);
          expect(minHeap.length).toEqual(3);
          expect(minHeap.toArray().sort((a, b) => a - b)).toEqual([1, 2, 3]);
        });

        it('should keep the N largest values for max-heap', async function () {
          const maxHeap = new HeapAsync(HeapAsync.maxComparatorNumber);
          await maxHeap.setLimit(3);
          await maxHeap.push(5, 1, 8, 2, 9, 3, 7);
          expect(maxHeap.length).toEqual(3);
          expect(maxHeap.toArray().sort((a, b) => b - a)).toEqual([9, 8, 7]);
        });

        it('should keep the N best values when limit is set after init', async function () {
          const minHeap = new HeapAsync(HeapAsync.minComparatorNumber);
          await minHeap.init([5, 1, 8, 2, 9, 3, 7]);
          await minHeap.setLimit(3);
          expect(minHeap.length).toEqual(3);
          expect(minHeap.toArray().sort((a, b) => a - b)).toEqual([1, 2, 3]);
        });

        it('should reject elements worse than the worst kept when at capacity', async function () {
          const minHeap = new HeapAsync(HeapAsync.minComparatorNumber);
          await minHeap.setLimit(3);
          await minHeap.push(1, 2, 3);
          expect(await minHeap.add(4)).toBe(false); // 4 is worse than 3
          expect(await minHeap.add(5)).toBe(false); // 5 is worse than 3
          expect(minHeap.length).toEqual(3);
          expect(minHeap.toArray().sort((a, b) => a - b)).toEqual([1, 2, 3]);
        });

        it('should accept elements better than the worst kept when at capacity', async function () {
          const minHeap = new HeapAsync(HeapAsync.minComparatorNumber);
          await minHeap.setLimit(3);
          await minHeap.push(3, 4, 5);
          expect(await minHeap.add(2)).toBe(true); // 2 is better than 5
          expect(await minHeap.add(1)).toBe(true); // 1 is better than 4
          expect(minHeap.length).toEqual(3);
          expect(minHeap.toArray().sort((a, b) => a - b)).toEqual([1, 2, 3]);
        });

        it('should maintain heap property after limit enforcement', async function () {
          const minHeap = new HeapAsync(HeapAsync.minComparatorNumber);
          await minHeap.setLimit(5);
          for (let i = 100; i > 0; i--) {
            await minHeap.push(i);
          }
          expect(minHeap.length).toEqual(5);
          expect(await minHeap.check()).toBeUndefined();
          expect(minHeap.toArray().sort((a, b) => a - b)).toEqual([1, 2, 3, 4, 5]);
        });
      });

      describe('#peek()', function () {
        it('should return the top element of the heap', async function () {
          const minValue = top(...values);
          const maxValue = bottom(...values);
          const peek = (await heap.compare(minValue, maxValue)) < 0 ? minValue : maxValue;
          await heap.init(values);
          expect(heap.peek()).toEqual(peek);
        });
      });

      describe('#pop() / poll', function () {
        it('should return undefined if heap is empty', async function () {
          expect(await heap.pop()).toBeUndefined();
        });
        it('should extract the peek if length is 1', async function () {
          await heap.init([999]);
          expect(await heap.pop()).toBe(999);
          expect(heap.length).toBe(0);
        });
        it('should extract the element at the top, and keep the heap sorted', async function () {
          await heap.init(values);
          const peek = heap.peek();
          const len = heap.length;
          expect(await heap.pop()).toEqual(peek);
          expect(heap.length).toEqual(len - 1);
          expect(await heap.check()).not.toBeDefined();
        });
      });

      describe('#push() / add', function () {
        it('should add one element to the heap, sorted', async function () {
          const len = heap.length;
          for (const value of values) {
            await heap.push(value);
          }
          expect(heap.length).toEqual(len + values.length);
          await expect(await heap.check()).toBeUndefined();
        });
        it('should add many elements to the heap, sorted', async function () {
          await heap.init(values);
          const len = heap.length;
          const otherValues = values.slice(0, Math.floor(values.length / 2));
          await heap.push(...otherValues);
          expect(heap.length).toEqual(len + otherValues.length);
          await expect(await heap.check()).toBeUndefined();
        });
        it('should ignore empty calls', async function () {
          await heap.push(...values);
          const len = heap.length;
          expect(await heap.push()).toBe(false);
          expect(heap.length).toEqual(len);
          await expect(await heap.check()).toBeUndefined();
        });
      });
      describe('addAll', function () {
        it('should add all elements to the heap, sorted', async function () {
          await heap.init(values);
          const len = heap.length;
          await heap.addAll(values);
          expect(heap.length).toEqual(len + values.length);
          await expect(await heap.check()).toBeUndefined();
        });
      });

      describe('#pushpop(element)', function () {
        it('should return the element without comparing when the heap is empty', async function () {
          const compare = jest.spyOn(heap, 'compare');
          const element = values[0];
          expect(await heap.pushpop(element)).toBe(element);
          expect(heap.toArray()).toEqual([]);
          expect(compare).not.toHaveBeenCalled();
        });
        it('should push a below-peek and pop the peek, and keep the heap sorted', async function () {
          // Get first child of peek
          await heap.init(values);
          const next = heap.heapArray[1];
          // Load the heap without that element
          const heapArray = [...heap.heapArray];
          heapArray.splice(1, 1);
          await heap.init(heapArray);
          const peek = heap.peek();
          const len = heap.length;
          // Add it
          expect(await heap.pushpop(next)).toEqual(peek);
          expect(heap.length).toEqual(len);
          expect(await heap.check()).not.toBeDefined();
        });
        it('should push an above-peek and pop the peek, and keep the heap sorted', async function () {
          // Get the peek
          await heap.init(values);
          const next = heap.heapArray[0];
          // Load the heap without that element
          const heapArray = heap.heapArray.slice(1);
          await heap.init(heapArray);
          const len = heap.length;
          // Add it
          expect(await heap.pushpop(next)).toEqual(next);
          expect(heap.length).toEqual(len);
          expect(await heap.check()).not.toBeDefined();
        });
      });

      describe('#remove()', function () {
        it('should skip an empty heap', async function () {
          expect(await heap.remove()).toBe(false);
        });
        it('should skip if no element matches', async function () {
          await heap.init(values);
          const len = heap.length;
          expect(await heap.remove(50000)).toBe(false);
          expect(heap.length).toBe(len);
        });
        it('should remove the peek if it matches and length is 1', async function () {
          await heap.init([999]);
          expect(await heap.remove(999)).toBe(true);
          expect(heap.length).toBe(0);
        });
        it('should remove the leaf if it matches the end', async function () {
          await heap.init(values);
          const len = heap.length;
          const bottom = heap.heapArray[heap.length - 1];
          expect(await heap.remove(bottom)).toBe(true);
          expect(heap.heapArray[heap.length - 1]).not.toBe(bottom);
          expect(heap.length).toBe(len - 1);
          expect(await heap.check()).not.toBeDefined();
        });
        it('should remove the element from the heap, and keep the heap sorted', async function () {
          await heap.init(values);
          const len = heap.length;
          expect(await heap.remove(values[3])).toBe(true);
          expect(await heap.remove(values[4])).toBe(true);
          expect(heap.length).toBe(len - 2);
          expect(await heap.check()).not.toBeDefined();
        });
        it('without element, should remove the peek', async function () {
          await heap.init(values);
          const peek = heap.peek();
          const len = heap.length;
          expect(await heap.remove()).toBe(true);
          expect(heap.peek()).not.toBe(peek);
          expect(heap.length).toBe(len - 1);
          expect(await heap.check()).toBeUndefined();
        });
        it('with comparison function, should remove custom match element', async function () {
          await heap.init(values);
          const len = heap.length;
          // Custom function that matches latest value, ignoring 999
          expect(await heap.remove(999, async (el, o) => el === values[values.length - 1])).toBe(true);
          expect(heap.length).toBe(len - 1);
          expect(await heap.check()).not.toBeDefined();
        });
      });

      describe('#replace(element)', function () {
        it('should put the element at the top, and then sort it', async function () {
          await heap.init(values);
          const len = heap.length;
          const peek = heap.peek();
          expect(await heap.replace(3000)).toEqual(peek);
          expect(heap.length).toEqual(len);
          expect(await heap.contains(3000)).toBe(true);
          expect(await heap.check()).not.toBeDefined();
        });
      });

      describe('#top(N)', function () {
        it('should return an empty array for an empty heap', async function () {
          expect(await heap.top()).toEqual([]);
          expect(await heap.top(10)).toEqual([]);
        });
        it('should return an empty array for invalid N', async function () {
          await heap.init(values);
          expect(await heap.top(0)).toEqual([]);
          expect(await heap.top(-10)).toEqual([]);
        });
        it('should return the top N (<= length) elements of the heap', async function () {
          await heap.init(values.concat(values));
          const topArr = heap.toArray().slice(0);
          topArr.sort((a, b) => (top(a, b) === a ? -1 : 1));
          for (const slice of [1, Math.floor(values.length / 2), values.length, values.length + 100]) {
            const topValues = await heap.top(slice);
            equalUnsortedArrays(topValues, topArr.slice(0, slice));
          }
        });
        it('should return the top element of the heap if no N', async function () {
          await heap.init(values.concat(values));
          expect(await heap.top()).toEqual(await heap.top(1));
        });
        it('should return the peek at index 0 for every N', async function () {
          await heap.init(values.concat(values));
          for (let n = 1; n <= heap.length + 1; ++n) {
            expect((await heap.top(n))[0]).toEqual(heap.peek());
          }
        });
      });

      describe('#toArray()', function () {
        it('should return an array', async function () {
          await heap.init(values);
          const arr = heap.toArray();
          expect(Array.isArray(arr)).toBe(true);
          expect(arr.length).toEqual(values.length);
          const clonedValues = values.slice(0);
          equalUnsortedArrays(arr, clonedValues);
        });
      });

      describe('#toString()', function () {
        it('should return an string', async function () {
          await heap.init(values);
          expect(heap.toString().length).toEqual(values.toString().length);
        });
      });

      describe('is Iterable', function () {
        it('should be iterable via for...of', async function () {
          await heap.init(values.concat(values));
          const top = heap.toArray().slice(0);
          const result: unknown[] = [];
          for (const value of heap) {
            result.push(await value);
          }
          equalUnsortedArrays(result, top);
        });
      });
      describe('#iterator()', function () {
        it('returns an iterable', async function () {
          await heap.init(values.concat(values));
          const topArr = heap.toArray().slice(0);
          topArr.sort((a, b) => (top(a, b) === a ? -1 : 1));
          const result: unknown[] = [];
          for (const value of heap.iterator()) {
            result.push(await value);
          }
          expect(result).toEqual(topArr);
        });
      });

      describe('#indexOf(element)', function () {
        it('should return the index of the element', async function () {
          await heap.init(values);
          for (let idx = 0; idx < heap.length; idx++) {
            const foundIdx = await heap.indexOf(heap.heapArray[idx]);
            expect(heap.heapArray[foundIdx]).toEqual(heap.heapArray[idx]);
          }
        });
        it('should return -1 if not found', async function () {
          await heap.init(values);
          expect(await heap.indexOf(99999)).toBe(-1);
        });
        it('should return -1 for empty heap', async function () {
          expect(await heap.indexOf(1)).toBe(-1);
        });
      });

      describe('#indexOf(element, fn)', function () {
        it('should find element with custom callback', async function () {
          await heap.init(values);
          const idx = await heap.indexOf(heap.heapArray[0], async (a, b) => a === b);
          expect(idx).toBe(0);
        });
        it('should return -1 with custom callback if not found', async function () {
          await heap.init(values);
          expect(await heap.indexOf(99999, async (a, b) => a === b)).toBe(-1);
        });
      });

      describe('#indexOfEvery(element)', function () {
        it('should return all indexes of a duplicated element', async function () {
          await heap.init(values.concat(values));
          const target = heap.heapArray[0];
          const indexes = await heap.indexOfEvery(target);
          expect(indexes.length).toBeGreaterThanOrEqual(2);
          for (const idx of indexes) {
            expect(heap.heapArray[idx]).toEqual(target);
          }
        });
        it('should return empty array if not found', async function () {
          await heap.init(values);
          expect(await heap.indexOfEvery(99999)).toEqual([]);
        });
        it('should return empty array for empty heap', async function () {
          expect(await heap.indexOfEvery(1)).toEqual([]);
        });
      });

      describe('#indexOfEvery(element, fn)', function () {
        it('should find indexes with custom callback', async function () {
          await heap.init(values.concat(values));
          const target = heap.heapArray[0];
          const indexes = await heap.indexOfEvery(target, async (a, b) => a === b);
          expect(indexes.length).toBeGreaterThanOrEqual(2);
          for (const idx of indexes) {
            expect(heap.heapArray[idx]).toEqual(target);
          }
        });
      });
    });
  });
});

describe('HeapAsync with options constructor', function () {
  describe('constructor', function () {
    it('should accept a comparator function (backward compatibility)', async function () {
      const heap = new HeapAsync<number>(async (a, b) => b - a);
      await heap.push(1, 2, 3);
      expect(heap.peek()).toBe(3);
    });

    it('should accept an options object with compare only', async function () {
      const heap = new HeapAsync<number>({ compare: async (a, b) => b - a });
      await heap.push(1, 2, 3);
      expect(heap.peek()).toBe(3);
    });

    it('should accept an options object with compare and isEqual', async function () {
      const isEqual = async (a: { id: number }, b: { id: number }) => a.id === b.id;
      const heap = new HeapAsync<{ id: number; name: string }>({
        compare: async (a, b) => a.id - b.id,
        isEqual,
      });
      await heap.push({ id: 1, name: 'a' }, { id: 2, name: 'b' }, { id: 3, name: 'c' });
      expect(heap.isEqual).toBe(isEqual);
    });

    it('should use default comparator when no options provided', async function () {
      const heap = new HeapAsync<number>();
      await heap.push(3, 1, 2);
      expect(heap.peek()).toBe(1);
    });

    it('should use default isEqual when not provided in options', function () {
      const heap = new HeapAsync<number>({ compare: async (a, b) => a - b });
      expect(heap.isEqual).toBe(HeapAsync.defaultIsEqual);
    });

    it('should use defaults when empty options object provided', async function () {
      const heap = new HeapAsync<number>({});
      await heap.push(3, 1, 2);
      expect(heap.peek()).toBe(1);
      expect(heap.isEqual).toBe(HeapAsync.defaultIsEqual);
    });
  });

  describe('with configured isEqual', function () {
    type Item = { id: number; name: string };
    let heap: HeapAsync<Item>;
    const isEqual = async (a: Item, b: Item) => a.id === b.id;

    beforeEach(async function () {
      heap = new HeapAsync<Item>({
        compare: async (a, b) => a.id - b.id,
        isEqual,
      });
      await heap.push({ id: 1, name: 'one' }, { id: 2, name: 'two' }, { id: 3, name: 'three' });
    });

    describe('#contains', function () {
      it('should use configured isEqual by default', async function () {
        expect(await heap.contains({ id: 2, name: 'different' })).toBe(true);
        expect(await heap.contains({ id: 99, name: 'not found' })).toBe(false);
      });

      it('should allow override with method callback', async function () {
        expect(await heap.contains({ id: 2, name: 'two' }, async (a, b) => a.name === b.name)).toBe(true);
        expect(await heap.contains({ id: 2, name: 'wrong' }, async (a, b) => a.name === b.name)).toBe(false);
      });
    });

    describe('#remove', function () {
      it('should use configured isEqual by default', async function () {
        expect(await heap.remove({ id: 2, name: 'different' })).toBe(true);
        expect(heap.length).toBe(2);
        expect(await heap.contains({ id: 2, name: 'any' })).toBe(false);
        expect(await heap.check()).not.toBeDefined();
      });

      it('should return false when not found', async function () {
        expect(await heap.remove({ id: 99, name: 'not found' })).toBe(false);
        expect(heap.length).toBe(3);
      });
    });

    describe('#clone', function () {
      it('should preserve isEqual configuration', async function () {
        const cloned = heap.clone();
        expect(cloned.isEqual).toBe(isEqual);
        expect(await cloned.contains({ id: 2, name: 'different' })).toBe(true);
      });
    });

    describe('#indexOf', function () {
      it('should use configured isEqual by default', async function () {
        const idx = await heap.indexOf({ id: 2, name: 'different' });
        expect(idx).not.toBe(-1);
        expect(heap.heapArray[idx].id).toBe(2);
      });

      it('should return -1 when not found', async function () {
        expect(await heap.indexOf({ id: 99, name: 'not found' })).toBe(-1);
      });
    });

    describe('#indexOfEvery', function () {
      it('should use configured isEqual by default', async function () {
        await heap.push({ id: 2, name: 'two-duplicate' });
        const indexes = await heap.indexOfEvery({ id: 2, name: 'any' });
        expect(indexes.length).toBe(2);
        for (const idx of indexes) {
          expect(heap.heapArray[idx].id).toBe(2);
        }
      });
    });
  });
});

describe('HeapAsync linear search fixes (#669)', function () {
  it('remove with needle-ignoring callback finds the element (#669 repro)', async function () {
    const heap = new HeapAsync<{ value: number }>(async (a, b) => b.value - a.value);
    await heap.add({ value: 1 });
    await heap.add({ value: 2 });
    await heap.add({ value: 3 });
    expect(await heap.remove(0 as any, async (a) => a.value === 2)).toBe(true);
    expect(heap.length).toBe(2);
    expect(await heap.check()).toBeUndefined();
  });

  it('remove(null) on object heap does not throw (#669 repro)', async function () {
    const heap = new HeapAsync<{ value: number }>(async (a, b) => b.value - a.value);
    await heap.add({ value: 1 });
    await heap.add({ value: 2 });
    await heap.add({ value: 3 });
    expect(await heap.remove(null as any)).toBe(false);
    expect(heap.length).toBe(3);
  });

  it('contains with needle-ignoring callback finds the element', async function () {
    const heap = new HeapAsync<{ value: number }>(async (a, b) => b.value - a.value);
    await heap.add({ value: 1 });
    await heap.add({ value: 2 });
    await heap.add({ value: 3 });
    expect(await heap.contains(0 as any, async (a) => a.value === 2)).toBe(true);
    expect(await heap.contains(0 as any, async (a) => a.value === 99)).toBe(false);
  });

  it('indexOf with needle-ignoring callback finds the element', async function () {
    const heap = new HeapAsync<{ value: number }>(async (a, b) => b.value - a.value);
    await heap.add({ value: 1 });
    await heap.add({ value: 2 });
    await heap.add({ value: 3 });
    const idx = await heap.indexOf(0 as any, async (a) => a.value === 2);
    expect(idx).not.toBe(-1);
    expect(heap.heapArray[idx].value).toBe(2);
  });

  it('indexOf returns -1 on empty heap', async function () {
    const heap = new HeapAsync<number>();
    expect(await heap.indexOf(1)).toBe(-1);
  });

  it('indexOf uses default equality (===) when no callback given', async function () {
    const heap = new HeapAsync<number>();
    await heap.push(10, 20, 30);
    expect(await heap.indexOf(20)).not.toBe(-1);
    expect(await heap.indexOf(99)).toBe(-1);
  });

  it('indexOfEvery returns [] on empty heap', async function () {
    const heap = new HeapAsync<number>();
    expect(await heap.indexOfEvery(1)).toEqual([]);
  });

  it('indexOfEvery uses default equality (===) when no callback given', async function () {
    const heap = new HeapAsync<number>();
    await heap.push(10, 20, 10, 30);
    const idxs = await heap.indexOfEvery(10);
    expect(idxs.length).toBe(2);
    for (const idx of idxs) {
      expect(heap.heapArray[idx]).toBe(10);
    }
  });

  it('indexOfEvery with custom callback finds all matches', async function () {
    const heap = new HeapAsync<{ value: number }>(async (a, b) => a.value - b.value);
    await heap.add({ value: 1 });
    await heap.add({ value: 2 });
    await heap.add({ value: 2 });
    await heap.add({ value: 3 });
    const idxs = await heap.indexOfEvery(0 as any, async (a) => a.value === 2);
    expect(idxs.length).toBe(2);
    for (const idx of idxs) {
      expect(heap.heapArray[idx].value).toBe(2);
    }
  });

  describe('HeapAsync.defaultIsEqual coverage', function () {
    it('should return true for equal values', async function () {
      expect(await HeapAsync.defaultIsEqual(1, 1)).toBe(true);
    });
    it('should return false for different values', async function () {
      expect(await HeapAsync.defaultIsEqual(1, 2)).toBe(false);
    });
  });
});

describe('HeapAsync hybrid _applyLimit', function () {
  it('eviction path: replaces worst leaf (not last) and re-sorts', async function () {
    const heap = new HeapAsync<number>(async (a, b) => a - b);
    heap.heapArray = [1, 3, 2, 7, 5, 4, 6];
    await heap.setLimit(6);
    expect(heap.length).toBe(6);
    expect(await heap.check()).toBeUndefined();
    expect(heap.toArray()).not.toContain(7);
  });

  it('pop-trim path: rebuilds heap when rm is large relative to limit', async function () {
    const heap = new HeapAsync<number>(async (a, b) => a - b);
    for (let i = 0; i < 1000; i++) await heap.push(i);
    await heap.setLimit(3);
    expect(heap.length).toBe(3);
    expect(await heap.check()).toBeUndefined();
    expect(heap.toArray().sort((a, b) => a - b)).toEqual([0, 1, 2]);
  });

  it('lazy setter defers trim; setLimit trims eagerly', async function () {
    const heap = new HeapAsync<number>(async (a, b) => a - b);
    await heap.push(1, 2, 3, 4, 5);
    heap.limit = 3;
    expect(heap.length).toBe(5);
    await heap.setLimit(3);
    expect(heap.length).toBe(3);
  });

  it('lazy setter: add() pre-trims when heap exceeds limit', async function () {
    const heap = new HeapAsync<number>(async (a, b) => a - b);
    await heap.push(1, 2, 3, 4, 5);
    heap.limit = 2;
    expect(heap.length).toBe(5);
    await heap.add(0);
    expect(heap.length).toBeLessThanOrEqual(2);
    expect(await heap.check()).toBeUndefined();
  });

  it('setLimit with NaN returns NaN and sets limit to 0', async function () {
    const heap = new HeapAsync<number>(async (a, b) => a - b);
    expect(await heap.setLimit(NaN)).toBe(NaN);
    expect(heap.limit).toBe(0);
  });

  it('setLimit with negative returns NaN and sets limit to 0', async function () {
    const heap = new HeapAsync<number>(async (a, b) => a - b);
    expect(await heap.setLimit(-5)).toBe(NaN);
    expect(heap.limit).toBe(0);
  });

  it('add returns false at capacity when element is worse', async function () {
    const heap = new HeapAsync<number>(async (a, b) => a - b);
    heap.limit = 3;
    await heap.push(1, 2, 3);
    expect(await heap.add(4)).toBe(false);
    expect(heap.length).toBe(3);
  });

  it('add returns true at capacity when element is better', async function () {
    const heap = new HeapAsync<number>(async (a, b) => a - b);
    heap.limit = 3;
    await heap.push(3, 4, 5);
    expect(await heap.add(2)).toBe(true);
    expect(heap.length).toBe(3);
    expect(await heap.check()).toBeUndefined();
  });
});
