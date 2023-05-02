import Heap from '../../src/Heap';
import { customBottom, customTop, customValues, someValues } from '../test-helpers';

describe('Heap instances', function () {
  const heaps = [
    {
      type: 'min heap (default)',
      factory: () => new Heap<any>(),
      values: someValues,
      top: Math.min,
      bottom: Math.max,
    },
    {
      type: 'max heap',
      factory: () => new Heap<any>(Heap.maxComparator),
      values: someValues,
      top: Math.max,
      bottom: Math.min,
    },
    {
      type: 'min number heap',
      factory: () => new Heap<any>(Heap.minComparatorNumber),
      values: someValues,
      top: Math.min,
      bottom: Math.max,
    },
    {
      type: 'max number heap',
      factory: () => new Heap<any>(Heap.maxComparatorNumber),
      values: someValues,
      top: Math.max,
      bottom: Math.min,
    },
    {
      type: 'custom array heap',
      factory: () => new Heap<any>((a, b) => a[1] - b[1]),
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
        it('should return an empty array for an empty heap', function () {
          expect(heap.bottom()).toEqual([]);
          expect(heap.bottom(10)).toEqual([]);
        });
        it('should return an empty array for invalid N', function () {
          heap.init(values);
          expect(heap.bottom(0)).toEqual([]);
          expect(heap.bottom(-10)).toEqual([]);
        });
        it('should return the peek for an one-element heap', function () {
          heap.push(1);
          expect(heap.bottom()).toEqual([1]);
          expect(heap.bottom(10)).toEqual([1]);
        });
        it('should return the lowest value N (<= length) elements of the heap', function () {
          heap.init(values.concat(values));
          const bottom = heap.toArray().slice(0);
          bottom.sort(heap._invertedCompare);
          for (const slice of [1, 6, values.length, values.length + 100]) {
            const b = heap.bottom(slice);
            b.sort(heap._invertedCompare);
            expect(b).toEqual(bottom.slice(0, slice));
          }
        });
        it('should return the lowest element of the heap if no N', function () {
          heap.init(values.concat(values));
          expect(heap.bottom()).toEqual(heap.bottom(1));
        });
      });

      describe('#check()', function () {
        it('should check if the heap is sorted', function () {
          heap.init(values);
          expect(heap.check()).not.toBeDefined();
          // Change comparison function to fail check
          heap.compare = (a, b) => 1;
          expect(heap.check()).toBeDefined();
        });
      });

      describe('#clear()', function () {
        it('should clear the heap', function () {
          heap.init(values);
          heap.clear();
          expect(heap.length).toEqual(0);
          expect(heap.toArray()).toEqual([]);
        });
      });

      describe('#clone()', function () {
        it('should clone the heap to a new one', function () {
          heap.init(values);
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
          heap.init(values);
          expect(heap.contains(values[5])).toBe(true);
        });
        it('should not find an element not in the heap', function () {
          heap.init(values);
          expect(heap.contains(5000)).toBe(false);
        });
      });

      describe('#contains(element, fn)', function () {
        it('should find an element in the heap', function () {
          heap.init(values);
          expect(heap.contains(values[5], (el, o) => el > o)).toBe(true);
        });
        it('should not find an element not in the heap', function () {
          heap.init(values);
          expect(heap.contains(1, (el, o) => el < o)).toBe(false);
        });
      });

      describe('#get(index)', function () {
        it('should return the element', function () {
          heap.init(values);
          expect(heap.get(0)).toEqual(heap.peek());
          expect(heap.get(5)).toEqual(heap.heapArray[5]);
        });
      });

      describe('#getChildrenOf(index)', function () {
        it('should return children elements', function () {
          heap.init(values);
          expect(heap.getChildrenOf(heap.length - 1)).toEqual([]);
          expect(heap.getChildrenOf(5)).toEqual(Heap.getChildrenIndexOf(5).map(heap.get.bind(heap)));
        });
      });

      describe('#getParentOf(index)', function () {
        it('should return the parent element', function () {
          heap.init(values);
          expect(heap.getParentOf(0)).toBeUndefined();
          expect(heap.getParentOf(5)).toBe(heap.get(2));
        });
      });

      describe('#indexOf(element)', function () {
        it('should return the index of the first occurrence of any element', function () {
          heap.init(values);
          let idx = 0;
          while (idx < heap.length) {
            const foundIdx = heap.indexOf(heap.heapArray[idx]);
            expect(Heap.defaultIsEqual(heap.heapArray[foundIdx], heap.heapArray[idx])).toBe(true);
            expect(foundIdx).toBeLessThanOrEqual(idx);
            idx += 1;
          }
        });
        it('should return -1 if the element is not in the heap', function () {
          heap.init(values);
          expect(heap.indexOf(99999)).toEqual(-1);
        });
        it('should return -1 if the heap is empty', function () {
          heap.init([]);
          expect(heap.indexOf(1)).toEqual(-1);
        });
        describe('with a custom equality function', function () {
          it('should return the index of any element', function () {
            heap.init(values);
            let idx = 0;
            while (idx < heap.length) {
              const foundIdx = heap.indexOf(heap.heapArray[idx], (el, o) => el === o);
              expect(Heap.defaultIsEqual(heap.heapArray[foundIdx], heap.heapArray[idx])).toBe(true);
              idx += 1;
              expect(foundIdx).toBeLessThanOrEqual(idx);
            }
          });
          it('should return -1 if the element is not in the heap', function () {
            heap.init(values);
            expect(heap.indexOf(99999, (el, o) => el === o)).toEqual(-1);
          });
          it('should return -1 if the heap is empty', function () {
            heap.init([]);
            expect(heap.indexOf(1, (el, o) => el === o)).toEqual(-1);
          });
        });
      });

      describe('#indexOfEvery()', function () {
        it('should return the index of every occurrence of any element', function () {
          heap.init(values);
          expect(heap.indexOfEvery(heap.heapArray[0])).toEqual([0]);
          heap.push(...values);
          const indexes = heap.indexOfEvery(heap.heapArray[0]);
          expect(indexes.length).toEqual(2);
          for (const index of indexes) {
            expect(heap.heapArray[index]).toEqual(heap.heapArray[0]);
          }
        });
        it('should return an empty array if the element is not in the heap', function () {
          heap.init(values);
          expect(heap.indexOfEvery(99999)).toEqual([]);
        });
        it('should return an empty array if the heap is empty', function () {
          heap.init([]);
          expect(heap.indexOfEvery(1)).toEqual([]);
        });
        describe('with a custom equality function', function () {
          it('should return the index of every occurrence of any element', function () {
            heap.init(values);
            expect(heap.indexOfEvery(heap.heapArray[0], (el, o) => el === o)).toEqual([0]);
            heap.push(...values);
            const indexes = heap.indexOfEvery(heap.heapArray[0], (el, o) => el === o);
            expect(indexes.length).toEqual(2);
            for (const index of indexes) {
              expect(heap.heapArray[index]).toEqual(heap.heapArray[0]);
            }
          });
          it('should return an empty array if the element is not in the heap', function () {
            heap.init(values);
            expect(heap.indexOfEvery(99999, (el, o) => el === o)).toEqual([]);
          });
        });
      });
      describe('#init()', function () {
        it('should initialize a new heap', function () {
          const otherValues = values.slice(0, Math.floor(values.length / 2));
          heap.init(values);
          heap.init(otherValues);
          expect(heap.length).toEqual(otherValues.length);
        });
        it('should balance the heap', function () {
          heap.heapArray = values.slice(0);
          heap.init();
          expect(heap.length).toEqual(values.length);
          expect(heap.check()).not.toBeDefined();
        });
      });

      describe('#isEmpty()', function () {
        it('should return if heap is empty', function () {
          const filledHeap = factory();
          filledHeap.add(values[0]);
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
          heap.init(values);
          const pi = Heap.getParentIndexOf(values.length - 1);
          expect(heap.leafs()).toEqual(heap.toArray().slice(pi + 1));

          const otherValues = values.slice(0, Math.floor(values.length / 2));
          const pio = Heap.getParentIndexOf(otherValues.length - 1);
          heap.init(otherValues);
          expect(heap.leafs()).toEqual(heap.toArray().slice(pio + 1));
        });
      });

      describe('#lenght / size()', function () {
        it('should return the heap length', function () {
          expect(heap.length).toEqual(0);
          expect(heap.size()).toEqual(0);
          heap.init(values);
          expect(heap.length).toEqual(values.length);
          expect(heap.size()).toEqual(values.length);
        });
      });

      describe('#limit', function () {
        it('should limit the heap length', function () {
          heap.init(values);
          expect(heap.length).toEqual(values.length);
          heap.limit = 5;
          expect(heap.limit).toEqual(5);
          expect(heap.length).toEqual(5);
          const otherValues = values.slice(0, Math.floor(values.length / 2));
          heap.push(...otherValues);
          expect(heap.length).toEqual(5);
          expect(heap.check()).not.toBeDefined();
        });
      });

      describe('#peek()', function () {
        it('should return the top element of the heap', function () {
          const minValue = top(...values);
          const maxValue = bottom(...values);
          const peek = heap.compare(minValue, maxValue) < 0 ? minValue : maxValue;
          heap.init(values);
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
          heap.init(values);
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
          values.forEach((el) => heap.push(el));
          expect(heap.length).toEqual(len + values.length);
          expect(heap.check()).not.toBeDefined();
        });
        it('should add many elements to the heap, sorted', function () {
          heap.init(values);
          const len = heap.length;
          const otherValues = values.slice(0, Math.floor(values.length / 2));
          heap.push(...otherValues);
          expect(heap.length).toEqual(len + otherValues.length);
          expect(heap.check()).not.toBeDefined();
        });
        it('should ignore empty calls', function () {
          heap.push(...values);
          const len = heap.length;
          expect(heap.push()).toBe(false);
          expect(heap.length).toEqual(len);
        });
      });

      describe('#pushpop(element)', function () {
        it('should push a below-peek and pop the peek, and keep the heap sorted', function () {
          // Get first child of peek
          heap.init(values);
          const next = heap.heapArray[1];
          // Load the heap without that element
          const heapArray = [...heap.heapArray];
          heapArray.splice(1, 1);
          heap.init(heapArray);
          const peek = heap.peek();
          const len = heap.length;
          // Add it
          expect(heap.pushpop(next)).toEqual(peek);
          expect(heap.length).toEqual(len);
          expect(heap.check()).not.toBeDefined();
        });
        it('should push an above-peek and pop the peek, and keep the heap sorted', function () {
          // Get the peek
          heap.init(values);
          const next = heap.heapArray[0];
          // Load the heap without that element
          const heapArray = heap.heapArray.slice(1);
          heap.init(heapArray);
          const len = heap.length;
          // Add it
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
          heap.init(values);
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
          heap.init(values);
          const len = heap.length;
          const bottom = heap.heapArray[heap.length - 1];
          expect(heap.remove(bottom)).toBe(true);
          expect(heap.heapArray[heap.length - 1]).not.toBe(bottom);
          expect(heap.length).toBe(len - 1);
          expect(heap.check()).not.toBeDefined();
        });
        it('should remove the element from the heap, and keep the heap sorted', function () {
          heap.init(values);
          const len = heap.length;
          expect(heap.remove(values[3])).toBe(true);
          expect(heap.remove(values[4])).toBe(true);
          expect(heap.length).toBe(len - 2);
          expect(heap.check()).not.toBeDefined();
        });
        it('whithout element, should remove the peek', function () {
          heap.init(values);
          const peek = heap.peek();
          const len = heap.length;
          expect(heap.remove()).toBe(true);
          expect(heap.peek()).not.toBe(peek);
          expect(heap.length).toBe(len - 1);
          expect(heap.check()).not.toBeDefined();
        });
        it('with comparison function, should remove custom match element', function () {
          heap.init(values);
          const len = heap.length;
          // Custom function that matches latest value, ignoring 999
          expect(heap.remove(999, (el, o) => el === values[values.length - 1])).toBe(true);
          expect(heap.length).toBe(len - 1);
          expect(heap.check()).not.toBeDefined();
        });
      });

      describe('#replace(element)', function () {
        it('should put the element at the top, and then sort it', function () {
          heap.init(values);
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
          heap.init(values);
          expect(heap.top(0)).toEqual([]);
          expect(heap.top(-10)).toEqual([]);
        });
        it('should return the top N (<= length) elements of the heap', function () {
          heap.init(values.concat(values));
          const top = heap.toArray().slice(0);
          top.sort(heap.comparator());
          for (const slice of [1, 6, values.length, values.length + 100]) {
            const topValues = heap.top(slice);
            topValues.sort(heap.compare);
            expect(topValues).toEqual(top.slice(0, slice));
          }
        });
        it('should return the top element of the heap if no N', function () {
          heap.init(values.concat(values));
          expect(heap.top()).toEqual(heap.top(1));
        });
      });

      describe('#toArray()', function () {
        it('should return an array', function () {
          heap.init(values);
          const arr = heap.toArray();
          expect(Array.isArray(arr)).toBe(true);
          expect(arr.length).toEqual(values.length);
          const clonedValues = values.slice(0);
          clonedValues.sort(heap.comparator());
          arr.sort(heap.comparator());
          expect(arr).toEqual(clonedValues);
        });
      });

      describe('#toString()', function () {
        it('should return an string', function () {
          heap.init(values);
          expect(heap.toString().length).toEqual(values.toString().length);
        });
      });

      describe('is Iterable', function () {
        it('should be iterable via for...of, consuming the heap', function () {
          heap.init(values.concat(values));
          const top = heap.toArray().slice(0);
          top.sort(heap.comparator());
          const resultFirstRound: unknown[] = [];
          for (const value of heap) {
            resultFirstRound.push(value);
          }
          const resultSecondRound: unknown[] = [];
          for (const value of heap) {
            resultSecondRound.push(value);
          }
          expect(resultFirstRound).toEqual(top);
          expect(resultSecondRound).toEqual([]);
        });
      });
      describe('#iterator()', function () {
        it('returns an iterable that does not consume the heap', function () {
          heap.init(values.concat(values));
          const top = heap.toArray().slice(0);
          const resultFirstRound: unknown[] = [];
          for (const value of heap.iterator()) {
            resultFirstRound.push(value);
          }
          const resultSecondRound: unknown[] = [];
          for (const value of heap.iterator()) {
            resultSecondRound.push(value);
          }
          expect(resultFirstRound).toEqual(top);
          expect(resultSecondRound).toEqual(top);
        });
      });
    });
  });
});
