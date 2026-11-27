# ![Heap.js logo](assets/heap-js.png) Heap.js

[![npm version](https://img.shields.io/npm/v/heap-js.svg?style=flat)](https://www.npmjs.com/package/heap-js)
[![Test suite](https://github.com/ignlg/heap-js/actions/workflows/npm-test.yml/badge.svg)](https://github.com/ignlg/heap-js/actions/workflows/npm-test.yml)

**Efficient binary heap and priority queue for JavaScript and TypeScript.**

Min heap, max heap, custom comparators, top K elements, and async comparators with `HeapAsync`. Includes JavaScript methods, Python's _heapq module_ methods, and Java's _PriorityQueue_ methods.

Easy to use, known interfaces, tested, and well-documented. Instances are min heaps by default.

## Installation

```bash
npm install heap-js

yarn add heap-js

pnpm add heap-js
```

This README documents v4, still a prerelease. Install it with the `next` tag, `npm install heap-js@next`; the commands above install v3.

## Migrating from v3 to v4

Iterating a heap no longer consumes it. Addressing [#660](https://github.com/ignlg/heap-js/issues/660).

- `for (const value of heap)`, `[...heap]`, `Array.from(heap)`, and destructuring iterate in order of priority and leave the heap intact. In v3 they emptied it, the same as calling `pop()` in a loop.
- Use `heap.drain()` to keep the v3 behavior: `for (const value of heap.drain())`. It also yields the elements pushed while draining, like a priority queue loop.
- Iterating throws `Heap modified during iteration` if you `push`, `pop`, `add`, `remove`, `clear`, or `init` the heap inside the loop. Use `drain()` for those loops. `replace` and `pushpop` keep the length and are not detected, so avoid them while iterating.
- Code that expected the heap to be empty after a `for...of` will not fail, it will just keep the elements. Search for `of heap`, `...heap`, and `Array.from(heap)` and switch to `drain()` where consuming is intended.
- `Heap.nlargest`, `Heap.nsmallest`, and the other methods that accept an iterable no longer empty a heap passed as the iterable.
- `HeapAsync` is async iterable instead of an iterable of promises. Replace `for (const promise of heap) { await promise }` with `for await (const value of heap)` to keep the heap, or `for await (const value of heap.drain())` to consume it. The old loop throws a `TypeError`, the heap is not iterable.
- `HeapAsync.iterator()` returns the same as `toArray()`, values instead of promises, and does not consume the heap. Awaiting its values still works.
- `HeapAsync` iteration needs `Symbol.asyncIterator`, available since Node.js 10 and in current browsers.

## Migrating from v2 to v3

- The constructor also accepts an options object: `new Heap({ compare, isEqual })`. Passing a comparator function still works.
- `limit` keeps the N best elements. In v2 it removed elements from the end of the internal array, regardless of their priority.
- `add`, `offer`, and `push` with one element return `false` when the heap is at its `limit` and the element is not better than the worst one. In v2 they always returned `true`.
- `HeapAsync.setLimit` is async: use `await heap.setLimit(n)`. Assigning `heap.limit = n` on a `HeapAsync` applies the limit on the next `add`.
- `indexOf`, `indexOfEvery`, `contains`, and `remove` check every element, so custom callbacks always find their matches (also in 2.7.2). Use the `isEqual` option to set the default equality function.

## Is it faster than sorting an array?

It depends on your usage. For a handful of elements, sorting an array is as fast or faster. For larger inputs, and for queues that change while they are consumed, a heap is much faster:

```
priority queue: push 2 + pop 1, 50000 elements
 heap         x 71.98 ops/sec ±8.73% (65 runs sampled)
 sorted array x 8.40 ops/sec ±7.15% (25 runs sampled)

running median: 50000 elements
 two heaps    x 63.66 ops/sec ±7.08% (67 runs sampled)
 sorted array x 9.24 ops/sec ±4.69% (27 runs sampled)

top 100 of 100000 elements
 nlargest x 224 ops/sec ±6.74% (76 runs sampled)
 sort     x 26.29 ops/sec ±5.12% (47 runs sampled)

init + pop 100 of 100000 elements
 heap  x 210 ops/sec ±4.67% (70 runs sampled)
 sort  x 24.71 ops/sec ±5.40% (45 runs sampled)

iteration in order: first 10 of 100000
 for...of           x 1,696,737 ops/sec ±1.65% (92 runs sampled)
 toArray() + sort() x 34.39 ops/sec ±12.40% (48 runs sampled)

iteration in order: first 100000 of 100000
 for...of           x 53.63 ops/sec ±0.61% (71 runs sampled)
 toArray() + sort() x 32.90 ops/sec ±10.72% (46 runs sampled)

heap vs array: push + peek 99
 heap  x 228,187 ops/sec ±6.65% (71 runs sampled)
 array x 127,672 ops/sec ±5.70% (67 runs sampled)
```

The sorted array uses binary search to insert, the fastest array alternative. Iterating with `for...of` keeps the heap intact, and reading the first elements does not sort the whole heap. Measured on Node.js 26 and an Apple M3. Run them with `npm run benchmark`.

## Warnings

- Since v4, iterating the heap with `for (const value of heap)` does not consume it. Use `drain()` to consume it, see [Migrating from v3 to v4](#migrating-from-v3-to-v4).
- Do not modify the heap while iterating it with `for...of`: it throws. Use `drain()` to push while consuming.

## Examples

### Basic usage

#### Min Heap

A heap where the smallest element is always at the top. It is the default heap.

```js
import { Heap } from 'heap-js';

// Min Heap by default
const minHeap = new Heap();

// Initialize the heap with an array
minHeap.init([5, 18, 1]);
// Push a new value
minHeap.push(2);

console.log(minHeap.peek()); //> 1
console.log(minHeap.pop()); //> 1
console.log(minHeap.peek()); //> 2
```

#### Max Heap

A heap where the largest element is always at the top.

```js
import { Heap } from 'heap-js';

// Max Heap
const maxHeap = new Heap({ compare: Heap.maxComparator });

// Initialize the heap with an array
maxHeap.init([3, 4, 1, 12, 8]);
// Push a new value
maxHeap.push(2);

console.log(maxHeap.peek()); //> 12
console.log(maxHeap.pop()); //> 12
console.log(maxHeap.peek()); //> 8
```

#### Custom Heap

A heap where the most important element is always at the top, but the elements are objects with a `priority` property.

```js
import { Heap } from 'heap-js';

const customPriorityComparator = (a, b) => a.priority - b.priority;
// Custom Heap
const customHeap = new Heap({ compare: customPriorityComparator });

// Initialize the heap with an array
customHeap.init([{ priority: 5 }, { priority: 18 }, { priority: 1 }]);
// Push a new value
customHeap.push({ priority: 2 });

console.log(customHeap.peek()); //> { priority: 1 }
console.log(customHeap.pop()); //> { priority: 1 }
console.log(customHeap.peek()); //> { priority: 2 }
```

#### Min HeapAsync

A heap where the most important element is always at the top, the elements are objects with a `priority` property, and the comparator function is asynchronous. Implements the same interface as `Heap`, but almost all methods return a `Promise`.

```js
import { HeapAsync } from 'heap-js';

const customPriorityComparator = (a, b) => Promise.resolve(a.priority - b.priority);
// Custom HeapAsync
const customHeap = new HeapAsync({ compare: customPriorityComparator });

// Initialize the heap with an array
await customHeap.init([{ priority: 5 }, { priority: 18 }, { priority: 1 }]);
// Push a new value
await customHeap.push({ priority: 2 });

console.log(customHeap.peek()); //> { priority: 1 }
console.log(await customHeap.pop()); //> { priority: 1 }
console.log(customHeap.peek()); //> { priority: 2 }
```

### Priority Queue usage

#### JavaScript-style iterator (recommended)

Iterates over the heap in the order of priority without consuming it. Lazy: reading the first k elements does not sort the whole heap.

```js
const { Heap } = require('heap-js');

// Get all tasks from the database
const tasks = db.collection.find().toArray();
// The most important task has the lowest priority value
const customPriorityComparator = (a, b) => a.priority - b.priority;

// Create the priority queue
const priorityQueue = new Heap({ compare: customPriorityComparator });
// Initialize the priority queue with the tasks
priorityQueue.init(tasks);

// Iterator that traverses the heap in the order of priority, keeping it intact
for (const task of priorityQueue) {
  console.log(task);
}
```

#### Draining iterator

Iterates over the heap in the order of priority consuming it, the same as calling `pop()` in a loop. Elements pushed while draining are also yielded in order.

```js
// Iterator that consumes the heap, and accepts new tasks while running
for (const task of priorityQueue.drain()) {
  for (const subtask of run(task)) {
    priorityQueue.push(subtask);
  }
}
```

With `HeapAsync`, use `for await (const task of priorityQueue)` and `for await (const task of priorityQueue.drain())`.

#### Java-style iterator (not recommended)

Iterates over the heap without consuming it, but does not guarantee to traverse the elements of the heap in any particular order. Barely useful, it is the fastest way to read every element when order does not matter.

```js
const { Heap } = require('heap-js');

// Get all tasks from the database
const tasks = db.collection.find().toArray();
// The most important task has the lowest priority value
const customPriorityComparator = (a, b) => a.priority - b.priority;

const priorityQueue = new Heap({ compare: customPriorityComparator });
// Initialize the priority queue with the tasks
priorityQueue.init(tasks);

// Iterator, the Java way, that will not consume the heap BUT does not guarantee to traverse the elements of the heap in any particular order. Barely useful.
for (const task of priorityQueue.iterator()) {
  console.log(task);
}
```

### TypeScript

```ts
import { Heap } from 'heap-js';

interface Task {
  name: string;
  priority: number;
}

const tasks = new Heap<Task>({ compare: (a, b) => a.priority - b.priority });
tasks.push({ name: 'write', priority: 2 }, { name: 'test', priority: 1 });

console.log(tasks.pop()?.name); //> test
```

### Top K elements

```js
import { Heap } from 'heap-js';

const numbers = [5, 18, 1, 9, 3, 12];

// The 3 most valuable elements of any iterable, as Python's heapq
console.log(Heap.nlargest(3, numbers, Heap.maxComparatorNumber)); //> [ 18, 9, 12 ] (partially ordered)

// Keep only the best 3 elements while pushing
const best = new Heap(Heap.maxComparatorNumber);
best.limit = 3;
best.push(...numbers);
console.log(best.toArray()); //> [ 18, 9, 12 ] (partially ordered)
```

### Python-like static methods

```js
import { Heap } from 'heap-js';
const numbers = [2, 3, 7, 5];

// Changes the array elements order into a heap in-place
Heap.heapify(numbers);
console.log(numbers); //> [ 2, 3, 5, 7 ]

// Pushes a new value to the heap
Heap.heappush(numbers, 1);
console.log(numbers); //> [ 1, 2, 5, 7, 3 ]
```

## Constructor

### Heap

```js
new Heap();
new Heap(comparator);
new Heap({ compare: comparator, isEqual: isEqual });
```

### HeapAsync

```js
new HeapAsync();
new HeapAsync(asyncComparator);
new HeapAsync({ compare: asyncComparator, isEqual: isEqual });
```

### Options

- `compare` the comparison function. Defaults to `Heap.minComparator`.
- `isEqual` the default equality function for `indexOf`, `indexOfEvery`, `contains`, and `remove`. Defaults to `===`.

## Comparators already included

- `Heap.minComparator`: Uses less-than operator to compare elements. It is the default comparator.
- `Heap.maxComparator`: Uses greater-than operator to compare elements.
- `Heap.minComparatorNumber`: Uses subtraction `a - b` to compare elements.
- `Heap.maxComparatorNumber`: Uses subtraction `b - a` to compare elements.

`HeapAsync` includes the same comparators, returning a `Promise`.

## Implements JavaScript-style methods

- `for (const value of heap)` directly usable as an Iterator, in order of priority, without consuming the heap. `HeapAsync` is usable with `for await (const value of heap)`.
- `drain()` iterates in order of priority consuming the heap, accepting new elements while iterating.
- `sortedIterator()` same as `for...of`, lazy: the first k elements cost O(k log k).
- `length` of the heap.
- `limit` limit the number of elements in the heap to the N most valuable elements. Adding at the limit costs O(N); for large N use `nsmallest` or `nlargest`. In HeapAsync, use the `setLimit` method to apply it immediately.
- `pop()` the top element, in O(log n).
- `push(...elements)` one or more elements to the heap, in O(log n) each.
- `pushpop(element)` faster than `push` & `pop`.
- `replace(element)` faster than `pop` & `push`.
- `setLimit(limit)` set the `limit` of the heap to the N most valuable elements.
- `top(number?)` most valuable elements from the heap.
- `bottom(number?)` least valuable elements from the heap.
- `indexOf(element, fn?)` returns the internal index of the first occurrence of the element in the heap, in O(n).
- `indexOfEvery(element, fn?)` returns an array with the internal indexes of all occurrences of the element in the heap.

## Implements Java's `PriorityQueue` interface

- `add(element)` to the heap.
- `addAll([element, element, ... ])` to the heap, faster than loop `add`.
- `clear()`
- `clone()`
- `comparator()`
- `contains(element, fn?)`
- _`element()` alias of `peek()`_
- `isEmpty()`
- `iterator()` returns the same as `toArray()` because it is iterable and follows Java's implementation, unordered. Use `for (const value of heap)` to iterate in order.
- _`offer(element)` alias of `add(element)`_
- `peek()` in O(1)
- _`poll()` alias of `pop()`_
- `remove(element?)`
- _`removeAll()` alias of `clear()`_
- _`size()` alias of `length`_
- `toArray()`
- `toString()`

To do:

- `containsAll`
- `equals`
- `retainAll`

## Implements static Python's `heapq` interface

- `Heap.heapify(array, comparator?)` that converts an array to an array-heap.
- `Heap.heappop(heapArray, comparator?)` that takes the peek of the array-heap.
- `Heap.heappush(heapArray, item, comparator?)` that appends elements to the array-heap.
- `Heap.heappushpop(heapArray, item, comparator?)` faster than `heappush` & `heappop`.
- `Heap.heapreplace(heapArray, item, comparator?)` faster than `heappop` & `heappush`.
- `Heap.nlargest(n, iterable, comparator?)` that gets the `n` most valuable elements of an iterable.
- `Heap.nsmallest(n, iterable, comparator?)` that gets the `n` least valuable elements of an iterable.

Extras:

- `Heap.heaptop(heapArray, n, comparator?)` that returns the `n` most valuable elements of the array-heap
- `Heap.heapbottom(heapArray, n, comparator?)` that returns the `n` least valuable elements of the array-heap

To do:

- `merge(...iterables, comparator?)`

## Documentation

<https://ignlg.github.io/heap-js/>

## Changelog

See [CHANGELOG.md](CHANGELOG.md). Latest: **4.0.0**, see [Migrating from v3 to v4](#migrating-from-v3-to-v4).

## Sponsor

We are looking for sponsors to help us maintain and improve **Heap.js**. You can support the project through [GitHub Sponsors](https://github.com/sponsors/ignlg).

## Collaborate

Would you like to contribute to **Heap.js**? Feel free to submit a pull request, open an issue, or reach out to the maintainers. We welcome your feedback and ideas!

### Dev setup

```bash
yarn
```

### Tests

```bash
npm run test
```

### Benchmarks

```bash
npm run benchmark
```

## Star History

[![Star History Chart](https://api.star-history.com/svg?repos=ignlg/heap-js&type=Date)](https://star-history.com/#ignlg/heap-js&Date)

## License

Heap.js is [BSD 3-Clause Licensed](LICENSE).
