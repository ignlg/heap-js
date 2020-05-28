# ![Heap.js](assets/heap-js.png) Heap.js

[![npm version](https://img.shields.io/npm/v/heap-js.svg?style=flat)](https://www.npmjs.com/package/heap-js)
[![Build Status](https://travis-ci.org/ignlg/heap-js.svg?branch=master)](https://travis-ci.org/ignlg/heap-js)
[![Coverage Status](https://img.shields.io/coveralls/ignlg/heap-js/master.svg?style=flat)](https://coveralls.io/github/ignlg/heap-js?branch=master)
[![Dependencies](https://david-dm.org/ignlg/heap-js.png?theme=shields.io)](https://david-dm.org/ignlg/heap-js)
[![devDependency Status](https://david-dm.org/ignlg/heap-js/dev-status.svg)](https://david-dm.org/ignlg/heap-js#info=devDependencies)

**Efficient Binary heap (priority queue, binary tree) data structure for JavaScript / TypeScript.**

Includes JavaScript methods, Python's _heapq module_ methods, and Java's _PriorityQueue_ methods.

Easy to use, known interfaces, tested, and well documented JavaScript binary heap library.

Instances are `integer min heap` by default.

[![Open in Gitpod](https://gitpod.io/button/open-in-gitpod.svg)](https://gitpod.io/#https://github.com/ignlg/heap-js)

## Is it faster than sorting an array?

It depends on your usage, but for some scenarios it is much faster:

```
heap vs array: push + pop/unshift 50
	heap  x 72,130 ops/sec ±0.50% (93 runs sampled)
	array x 121 ops/sec ±78.09% (5 runs sampled)

heap vs array: push + peek 20
	heap  x 622,332 ops/sec ±27.93% (63 runs sampled)
	array x 207 ops/sec ±78.18% (5 runs sampled)

heap vs array: push + top(1) of 100
	heap  x 124,835 ops/sec ±40.37% (61 runs sampled)
	array x 123 ops/sec ±78.49% (5 runs sampled)

heap vs array: push + top(50) of 100
	heap  x 59,210 ops/sec ±17.66% (82 runs sampled)
	array x 125 ops/sec ±78.79% (5 runs sampled)
```

## Changelog

### 2.1

- Adds `Heap.nlargest` as heapq.
- Adds `Heap.nsmallest` as heapq.
- Sanitizes `top` / `bottom` input to force an integer.
- Linted with Eslint.

### 2.0

The main breaking change is that now _`top(N)` does NOT sort the output_. It should not be part of the spec for a priority queue, the output should be the top N elements. It will be _partially ordered_ with the peek at index `0` by definition, that is all.

- `top(N)` is unordered, only the first element is guaranteed to be the top priority element.
- Fixes custom heap issue [#31](https://github.com/ignlg/heap-js/issues/31).
- Performance improvements.
- More tests, including those for custom heaps.
- Auxiliary experimental topN algorithms.
- (wip) Benchmarks.

### 1.5

- Adds `Iterator` interface and `iterator()` method.

## Examples

```js
// Basic usage example
import Heap from 'heap-js';

const minHeap = new Heap();
const maxHeap = new Heap(Heap.maxComparator);

minHeap.init([5, 18, 1]);
minHeap.push(2);
console.log(minHeap.peek()); //> 1
console.log(minHeap.pop()); //> 1
console.log(minHeap.peek()); //> 2

// Iterator
maxHeap.init([3, 4, 1, 12, 8]);
for (const value of maxHeap) {
  console.log('Next top value is', value);
}
```

```js
// Priority Queue usage example
const { Heap } = require('heap-js');

const tasks = db.collection.find().toArray();
const customPriorityComparator = (a, b) => a.priority - b.priority;

const priorityQueue = new Heap(customPriorityComparator);
priorityQueue.init(tasks);

// priorityQueue === priorityQueue.iterator()
for (const task of priorityQueue) {
  // Do something
}
```

```js
// Python-like static methods example
import { Heap } from 'heap-js';
const numbers = [2, 3, 7, 5];

Heap.heapify(numbers);
console.log(numbers); //> [ 2, 3, 5, 7 ]

Heap.heappush(numbers, 1);
console.log(numbers); //> [ 1, 2, 5, 7, 3 ]
```

## Installation

```bash
yarn add heap-js # if you use yarn

npm install --save heap-js # if you use npm
```

## Constructor

```js
new Heap([comparator]);
```

Basic comparators already included:

- `Heap.minComparator` Integer min heap _(default)_
- `Heap.maxComparator` Integer max heap

## Implements JavaScript style methods

- `length` of the heap
- `limit` amount of elements in the heap
- `pop()` the top element
- `push(...elements)` one or more elements to the heap
- `pushpop(element)` faster than `push` & `pop`
- `replace(element)` faster than `pop` & `push`
- `top(number?)` most valuable elements from the heap
- `bottom(number?)` least valuable elements from the heap

## Implements Java's `PriorityQueue` interface:

- `add(element)` to the heap
- `addAll([elment, element, ... ])` to the heap, faster than loop `add`
- `clear()`
- `clone()`
- `comparator()`
- `contains(element, fn?)`
- _`element()` alias of `peek()`_
- `isEmpty()`
- `iterator()` returns `this` because it is iterable
- _`offer(element)` alias of `add(element)`_
- `peek()`
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

## Implements static Python's `heapq` interface:

- `Heap.heapify(array, comparator?)` that converts an array to an array-heap
- `Heap.heappop(heapArray, comparator?)` that takes the peek of the array-heap
- `Heap.heappush(heapArray, item, comparator?)` that appends elements to the array-heap
- `Heap.heappushpop(heapArray, item, comparator?)` faster than `heappush` & `heappop`
- `Heap.heapreplace(heapArray, item, comparator?)` faster than `heappop` & `heappush`
- `Heap.nlargest(n, iterable, comparator?)` that gets the `n` most valuable elements of an iterable
- `Heap.nsmallest(n, iterable, comparator?)` that gets the `n` least valuable elements of an iterable

Extras:

- `Heap.heaptop(n, heapArray, comparator?)` that returns the `n` most valuable elements of the array-heap
- `Heap.heapbottom(n, heapArray, comparator?)` that returns the `n` least valuable elements of the array-heap

To do:

- `merge(...iterables, comparator?)`

## Documentation

Extensive documentation included at `./dist/docs`. It'll be published to `gh-pages` in a next release.

## Contributing

Development of **Heap.js** happens in the open on GitHub, and I am grateful to the community for contributing bugfixes and improvements.

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
npm run benchmarks
```

### License

Heap.js is [BSD licensed](LICENSE).
