# Changelog

### 3.0.0

The main breaking changes are that `setLimit` and `_applyLimit` methods of the HeapAsync class are now async, that setting the `limit` property of HeapAsync applies the limit on the next `add`, and that `add` returns `false` when the heap is at its limit and the element is not better than the worst one.

- Constructor now accepts an options object, `HeapOptions` and `HeapAsyncOptions`, with the `compare` and `isEqual` options.
- Adds the `isEqual` property to the `Heap` and `HeapAsync` classes to support custom equality functions to override the default equality function.
- `indexOf`, `indexOfEvery`, `contains`, and `remove` use a linear search, faster and consistent with any `isEqual`. Addressing [#669](https://github.com/ignlg/heap-js/issues/669).
- Setting a limit makes the heap evict the worst elements to keep the best N elements. Addressing [#656](https://github.com/ignlg/heap-js/issues/656).
- Setting the `limit` property of HeapAsync is applied on the next `add`; use the `setLimit` method to apply it immediately.
- Improves the performance of the limit when initializing or adding many elements.
- Adds `indexOf` and `indexOfEvery` to `HeapAsync`.

### 2.7.2

- Fixes `top(N)` not returning the peek at index `0`. Addressing [#672](https://github.com/ignlg/heap-js/issues/672). Thanks to @trackoor for the contribution.
- Fixes `indexOf`, `indexOfEvery`, `contains`, and `remove` missing elements with custom callbacks. They now use a linear search, which is also faster. Addressing [#669](https://github.com/ignlg/heap-js/issues/669).
- Adds `indexOf` and `indexOfEvery` to `HeapAsync`.
- Fixes `check` not detecting falsy children. Thanks to @RealBhupesh for the contribution.
- Fixes `addAll` stack overflow with large arrays.
- Fixes `pushpop` calling the comparator on empty heaps. Thanks to @fbirds5230 for the contribution.

### 2.7.1

- Optimize loop condition in HeapAsync init method.

### 2.7

- Improves performance of sorting methods. Thanks to @BeatsuDev for the contribution.
- Improves tests and documentation.

### 2.6

- Improves performance of remove and sorting methods.
- Improves tests and documentation.

### 2.5

- Improves the `limit` property to support negative, Infinity, and NaN values. They will be set as `0` and the heap will not be limited.
- Adds the `setLimit` method to set the limit of the heap. It returns `NaN` if the limit is negative, or NaN. This method is useful to check if the limit was set as expected.
- Improves tests and documentation.

### 2.4

- Adds the `indexOf` method to find the first index of an element in the heap.
- Adds the `indexOfEvery` method to find all indexes of an element in the heap.
- Changes the `remove` method to use the `indexOf` method.
- Changes the `contains` method to use the `indexOf` method.
- Improves documentation.

### 2.3

- Adds the `HeapAsync` class, with async methods and supporting async comparators. It is a drop-in replacement for the `Heap` class with Promises.

### 2.2

- Fixes `.iterator()` method to follow [Java's PriorityQueue implementation](https://docs.oracle.com/javase/8/docs/api/java/util/PriorityQueue.html):
  > The Iterator provided in method [iterator()](<https://docs.oracle.com/javase/8/docs/api/java/util/PriorityQueue.html#iterator()>) is not guaranteed to traverse the elements of the priority queue in any particular order.

Notice that _using the heap directly as an iterator will consume the heap,_ as Python's `heapq` implementation does.

### 2.1

- Adds `Heap.nlargest` as in `heapq`.
- Adds `Heap.nsmallest` as in `heapq`.
- Sanitizes `top` / `bottom` input to force an integer.
- Linted with Eslint.

### 2.0

The main breaking change is that now _`top(N)` does NOT sort the output_, because sorting should not be part of the spec for a priority queue. The output is the top N elements, and they will be _partially ordered_ with the peek at index `0` by definition.

- `top(N)` is unordered, only the first element is guaranteed to be the top priority element.
- Fixes custom heap issue [#31](https://github.com/ignlg/heap-js/issues/31).
- Performance improvements.
- More tests, including those for custom heaps.
- Auxiliary experimental `top(N)` algorithms.
- (WIP) Benchmarks.

### 1.5

- Adds the `Iterator` interface and `iterator()` method.
