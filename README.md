![Heap.js](assets/heap-js.png) Heap.js
======================================

[![Build Status](https://travis-ci.org/ignlg/heap-js.svg?branch=master)](https://travis-ci.org/ignlg/heap-js)
[![Dependencies](https://david-dm.org/ignlg/heap-js.png?theme=shields.io)](https://david-dm.org/ignlg/heap-js)
[![devDependency Status](https://david-dm.org/ignlg/heap-js/dev-status.svg)](https://david-dm.org/ignlg/heap-js#info=devDependencies)
[![Coverage Status](https://img.shields.io/coveralls/ignlg/heap-js/master.svg?style=flat)](https://coveralls.io/github/ignlg/heap-js?branch=master)
[![npm version](https://img.shields.io/npm/v/heap-js.svg?style=flat)](https://www.npmjs.com/package/heap-js)

`min heap` by default.

Usage:
```js
var minHeap = new Heap();
var maxHeap = new Heap(Heap.maxComparator);

minHeap.addAll([5, 18, 2, 1]);
console.log(minHeap.peek()); //> 1
```

Compatible with AMD and CommonJS.

Constructor
-----------
```js
new Heap([comparator])
```

Comparator for _min heap_ by default: `Heap.minComparator` = `(a, b) => a - b`

Implements JavaScript style methods
-----------------------------------
* `length` of the heap
* `pop()` top element
* `push(...elements)` to the heap
* `pushpop(element)` faster than `push` & `pop`
* `top(number?)` elements from the heap

Implements Java's `PriorityQueue` interface:
--------------------------------------------
* `add(element)` to the heap
* `addAll([elment, element, ... ])` to the heap, faster than loop `add`
* `clear()`
* `clone()`
* `comparator()`
* `contains(element, fn?)`
* _`element()` alias of `peek()`_
* `isEmpty()`
* _`offer(element)` alias of `add(element)`_
* `peek()`
* _`poll()` alias of `pop()`_
* `remove(element?)`
* _`removeAll()` alias of `clear()`_
* _`size()` alias of `length`_
* `toArray()`
* `toString()`

To do:
* containsAll
* equals
* iterator()
* retainAll

Implements static Python's `heaqp` interface:
---------------------------------------------
* `Heap.heapify(array)` that converts an array to an array-heap
* `Heap.heappop(heapArray)` that takes the peek of the array-heap
* `Heap.heappush(heapArray, item)` that appends elements to the array-heap
* `Heap.heappushpop(heapArray, item)` faster than `heappush` & `heappop`

To do:
* heapreplace(heap, item)
* merge(*iterables, key=None, reverse=False)
* nlargest(n, iterable, key=None)
* nsmallest(n, iterable, key=None)

Dev setup
---------
```bash
yarn # if you use yarn
npm install # if you use npm
```

Tests
-----
```bash
yarn test # if you use yarn
npm test # if you use npm
```
