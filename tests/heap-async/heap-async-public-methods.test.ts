import HeapAsync from '../../src/HeapAsync';
import { customMax, customMin, customValues, equalUnsortedArrays, someValues } from '../test-helpers';

describe('HeapAsync instances', function () {
  const heaps = [
    {
      type: 'min heap (default)',
      factory: () => new HeapAsync<any>(),
      values: someValues,
      min: Math.min,
      max: Math.max,
    },
    {
      type: 'max heap',
      factory: () => new HeapAsync<any>(HeapAsync.maxComparator),
      values: someValues,
      min: Math.min,
      max: Math.max,
    },
    {
      type: 'min number heap',
      factory: () => new HeapAsync<any>(HeapAsync.minComparatorNumber),
      values: someValues,
      min: Math.min,
      max: Math.max,
    },
    {
      type: 'max number heap',
      factory: () => new HeapAsync<any>(HeapAsync.maxComparatorNumber),
      values: someValues,
      min: Math.min,
      max: Math.max,
    },
    {
      type: 'custom array heap',
      factory: () => new HeapAsync<any>(async (a, b) => a[1] - b[1]),
      values: customValues,
      min: customMin,
      max: customMax,
    },
  ];

  heaps.forEach((heapInstance) => {
    const { type, factory, values, min, max } = heapInstance;
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
          const bottom = heap.toArray().slice(0);
          for (const slice of [1, 6, values.length, values.length + 100]) {
            const b = await heap.bottom(slice);
            equalUnsortedArrays(b, bottom.slice(0, slice));
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
          expect(heap.check()).resolves.not.toBeDefined();
          // Change comparison function to fail check
          heap.compare = async (a, b) => 1;
          expect(heap.check()).resolves.toBeDefined();
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
          expect(cloned.compare(2, 5)).resolves.toEqual(await heap.compare(2, 5));
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
        it('should return the parent element', async function () {
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

      describe('#lenght / size()', function () {
        it('should return the heap length', async function () {
          expect(heap.length).toEqual(0);
          expect(heap.size()).toEqual(0);
          await heap.init(values);
          expect(heap.length).toEqual(values.length);
          expect(heap.size()).toEqual(values.length);
        });
      });

      describe('#limit', function () {
        it('should limit the heap length', async function () {
          await heap.init(values);
          expect(heap.length).toEqual(values.length);
          heap.limit = 5;
          expect(heap.limit).toEqual(5);
          expect(heap.length).toEqual(5);
          const otherValues = values.slice(0, Math.floor(values.length / 2));
          await heap.push(...otherValues);
          expect(heap.length).toEqual(5);
          expect(await heap.check()).not.toBeDefined();
        });
      });

      describe('#peek()', function () {
        it('should return the top element of the heap', async function () {
          const minValue = min(...values);
          const maxValue = max(...values);
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

      describe('#push() / add, offer, addAll', function () {
        it('should add one element to the heap, sorted', async function () {
          const len = heap.length;
          for (const value of values) {
            await heap.push(value);
          }
          expect(heap.length).toEqual(len + values.length);
          expect(await heap.check()).not.toBeDefined();
        });
        it('should add many elements to the heap, sorted', async function () {
          await heap.init(values);
          const len = heap.length;
          const otherValues = values.slice(0, Math.floor(values.length / 2));
          await heap.push(...otherValues);
          expect(heap.length).toEqual(len + otherValues.length);
          expect(await heap.check()).not.toBeDefined();
        });
        it('should ignore empty calls', async function () {
          await heap.push(...values);
          const len = heap.length;
          expect(await heap.push()).toBe(false);
          expect(heap.length).toEqual(len);
        });
      });

      describe('#pushpop(element)', function () {
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
        it('whithout element, should remove the peek', async function () {
          await heap.init(values);
          const peek = heap.peek();
          const len = heap.length;
          expect(await heap.remove()).toBe(true);
          expect(heap.peek()).not.toBe(peek);
          expect(heap.length).toBe(len - 1);
          expect(await heap.check()).not.toBeDefined();
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
          const top = heap.toArray().slice(0);
          for (const slice of [1, 6, values.length, values.length + 100]) {
            const topValues = await heap.top(slice);
            equalUnsortedArrays(topValues, top.slice(0, slice));
          }
        });
        it('should return the top element of the heap if no N', async function () {
          await heap.init(values.concat(values));
          expect(await heap.top()).toEqual(await heap.top(1));
        });
      });

      describe('#toArray()', function () {
        it('should return an array', async function () {
          await heap.init(values);
          const arr = heap.toArray();
          expect(Array.isArray(arr)).toBe(true);
          expect(arr.length).toEqual(values.length);
          const clonedValues = values.slice(0);
          expect(arr).toEqual(clonedValues);
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
          const result = [];
          for (const value of heap) {
            result.push(await value);
          }
          equalUnsortedArrays(result, top);
        });
      });
      describe('#iterator()', function () {
        it('returns an iterable', async function () {
          await heap.init(values.concat(values));
          const top = heap.toArray().slice(0);
          const result = [];
          for (const value of heap.iterator()) {
            result.push(await value);
          }
          expect(result).toEqual(top);
        });
      });
    });
  });
});
