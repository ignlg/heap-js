const { Heap } = require('../dist/heap-js.umd');
const { runBenchmark } = require('./benchmark.helpers');

const MIN = 0;
const MAX = 100;
const N = 100;

const data = Array(N);
for (let i = 0; i < N; i++) {
  const value = Math.floor(MAX * Math.random() + MIN);
  data[i] = value;
}

console.log(`Data size:   ${N}`);
console.log(`Value range: ${MIN} - ${MAX}`);

const samples = [1, N / 10, N / 5, N / 2, N - 1].map((n) => Math.floor(n));

for (const n of samples) {
  const heap = new Heap();
  heap.init(data);
  runBenchmark(
    `heap internals: _topN_*(${n}) of ${N}`,
    ['_topN_push', '_topN_heap', '_topN_fill'].map((name) => ({
      name,
      func: function () {
        heap[name](n);
      },
    }))
  );
}

const compareNumbers = (a, b) => a - b;

// Heap and array are created on every cycle, so each run measures the same work
for (const n of samples) {
  runBenchmark(`heap vs array: push + pop/shift ${n}`, [
    {
      name: 'heap ',
      func: function () {
        const heap = new Heap(Heap.minComparatorNumber);
        for (let i = 0; i < n; i++) {
          heap.push(data[i]);
        }
        for (let i = 0; i < n; i++) {
          heap.pop();
        }
      },
    },
    {
      name: 'array',
      func: function () {
        const array = [];
        for (let i = 0; i < n; i++) {
          array.push(data[i]);
        }
        array.sort(compareNumbers);
        for (let i = 0; i < n; i++) {
          array.shift();
        }
      },
    },
  ]);
}

for (const n of samples) {
  runBenchmark(`heap vs array: push + peek ${n}`, [
    {
      name: 'heap ',
      func: function () {
        const heap = new Heap(Heap.minComparatorNumber);
        for (let i = 0; i < n; i++) {
          heap.push(data[i]);
        }
        heap.peek();
      },
    },
    {
      name: 'array',
      func: function () {
        const array = [];
        for (let i = 0; i < n; i++) {
          array.push(data[i]);
        }
        array.sort(compareNumbers);
        array[0];
      },
    },
  ]);
}

for (const n of samples) {
  runBenchmark(`heap vs array: init + peek ${n}`, [
    {
      name: 'heap ',
      func: function () {
        const heap = new Heap(Heap.minComparatorNumber);
        heap.init(data.slice(0, n));
        heap.peek();
      },
    },
    {
      name: 'array',
      func: function () {
        const array = data.slice(0, n);
        array.sort(compareNumbers);
        array[0];
      },
    },
  ]);
}

for (const n of samples) {
  runBenchmark(`heap vs array: push + top(${n}) of ${N}`, [
    {
      name: 'heap ',
      func: function () {
        const heap = new Heap(Heap.minComparatorNumber);
        for (let i = 0; i < N; i++) {
          heap.push(data[i]);
        }
        heap.top(n);
      },
    },
    {
      name: 'array',
      func: function () {
        const array = [];
        for (let i = 0; i < N; i++) {
          array.push(data[i]);
        }
        array.sort(compareNumbers);
        array.slice(0, n);
      },
    },
  ]);
}

/*
            Larger inputs, where a heap is the right tool
*/

const randomData = (size) => Array.from({ length: size }, () => Math.random());

// Binary search for the insertion index in a sorted array, the fastest array alternative
const sortedIndex = (array, value) => {
  let lo = 0;
  let hi = array.length;
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    if (array[mid] < value) lo = mid + 1;
    else hi = mid;
  }
  return lo;
};

for (const size of [10000, 50000]) {
  const big = randomData(size);
  // Like a scheduler or Dijkstra's algorithm: the queue keeps changing while it is consumed
  runBenchmark(`priority queue: push 2 + pop 1, ${size} elements`, [
    {
      name: 'heap        ',
      func: function () {
        const heap = new Heap(Heap.minComparatorNumber);
        for (let i = 0; i + 1 < size; i += 2) {
          heap.push(big[i]);
          heap.push(big[i + 1]);
          heap.pop();
        }
      },
    },
    {
      name: 'sorted array',
      func: function () {
        const array = [];
        for (let i = 0; i + 1 < size; i += 2) {
          array.splice(sortedIndex(array, big[i]), 0, big[i]);
          array.splice(sortedIndex(array, big[i + 1]), 0, big[i + 1]);
          array.shift();
        }
      },
    },
  ]);
}

for (const size of [10000, 50000]) {
  const big = randomData(size);
  runBenchmark(`running median: ${size} elements`, [
    {
      name: 'two heaps   ',
      func: function () {
        const lower = new Heap(Heap.maxComparatorNumber);
        const upper = new Heap(Heap.minComparatorNumber);
        for (let i = 0; i < size; i++) {
          const value = big[i];
          if (!lower.length || value <= lower.peek()) {
            lower.push(value);
          } else {
            upper.push(value);
          }
          if (lower.length > upper.length + 1) {
            upper.push(lower.pop());
          } else if (upper.length > lower.length) {
            lower.push(upper.pop());
          }
          lower.peek();
        }
      },
    },
    {
      name: 'sorted array',
      func: function () {
        const array = [];
        for (let i = 0; i < size; i++) {
          array.splice(sortedIndex(array, big[i]), 0, big[i]);
          array[array.length >> 1];
        }
      },
    },
  ]);
}

for (const size of [100000, 1000000]) {
  const big = randomData(size);
  runBenchmark(`top 100 of ${size} elements`, [
    {
      name: 'nlargest',
      func: function () {
        Heap.nlargest(100, big, Heap.minComparatorNumber);
      },
    },
    {
      name: 'sort    ',
      func: function () {
        big.slice().sort(compareNumbers).slice(0, 100);
      },
    },
  ]);
}

for (const size of [10000, 100000]) {
  const big = randomData(size);
  runBenchmark(`init + pop 100 of ${size} elements`, [
    {
      name: 'heap ',
      func: function () {
        const heap = new Heap(Heap.minComparatorNumber);
        heap.init(big);
        for (let i = 0; i < 100; i++) {
          heap.pop();
        }
      },
    },
    {
      name: 'sort ',
      func: function () {
        big.slice().sort(compareNumbers).slice(0, 100);
      },
    },
  ]);
}

/*
            Limit and search benchmarks
*/

const BIG = 200000;
const bigData = randomData(BIG);

for (const n of [100, 10000, 100000]) {
  runBenchmark(`limit: init ${BIG} keep ${n}`, [
    {
      name: 'heap limit',
      func: function () {
        const h = new Heap(Heap.minComparatorNumber);
        h.limit = n;
        h.init(bigData);
      },
    },
    {
      name: 'nlargest ',
      func: function () {
        Heap.nlargest(n, bigData, Heap.minComparatorNumber);
      },
    },
    {
      name: 'array    ',
      func: function () {
        bigData.slice().sort(compareNumbers).slice(0, n);
      },
    },
  ]);
}

for (const n of [100, 10000, 100000]) {
  runBenchmark(`limit: addAll ${BIG} keep ${n}`, [
    {
      name: 'heap limit',
      func: function () {
        const h = new Heap(Heap.minComparatorNumber);
        h.limit = n;
        h.addAll(bigData);
      },
    },
  ]);
}

for (const n of [100, 10000]) {
  const full = new Heap(Heap.minComparatorNumber);
  full.limit = n;
  full.init(bigData.slice(0, n));
  const noLimit = new Heap(Heap.minComparatorNumber);
  noLimit.init(bigData.slice(0, n));
  runBenchmark(`limit: push(a, b) at capacity ${n}`, [
    {
      name: 'heap limit   ',
      func: function () {
        const h = full.clone();
        for (let i = 0; i < 2000; i += 2) {
          h.push(bigData[i], bigData[i + 1]);
        }
      },
    },
    {
      name: 'heap no limit',
      func: function () {
        const h = noLimit.clone();
        for (let i = 0; i < 2000; i += 2) {
          h.push(bigData[i], bigData[i + 1]);
        }
      },
    },
  ]);
}

for (const n of [100, 10000]) {
  const full = new Heap(Heap.minComparatorNumber);
  full.limit = n;
  full.init(bigData.slice(0, n));
  runBenchmark(`limit: add() at capacity ${n}`, [
    {
      name: 'heap limit',
      func: function () {
        const h = full.clone();
        for (let i = 0; i < 2000; i++) {
          h.add(bigData[i]);
        }
      },
    },
  ]);
}

for (const size of [1000, 20000]) {
  const searchHeap = new Heap(Heap.minComparatorNumber);
  searchHeap.init(bigData.slice(0, size));
  const needles = Array.from({ length: 1000 }, (_, i) => searchHeap.heapArray[(i * 7919) % size]);
  runBenchmark(`search: ${size}`, [
    {
      name: 'indexOf       ',
      func: function () {
        for (let i = 0; i < needles.length; i++) {
          searchHeap.indexOf(needles[i]);
        }
      },
    },
    {
      name: 'indexOf custom',
      func: function () {
        for (let i = 0; i < needles.length; i++) {
          searchHeap.indexOf(needles[i], (a, b) => a === b);
        }
      },
    },
    {
      name: 'contains      ',
      func: function () {
        for (let i = 0; i < needles.length; i++) {
          searchHeap.contains(needles[i]);
        }
      },
    },
    {
      name: 'remove + push ',
      func: function () {
        for (let i = 0; i < needles.length; i++) {
          searchHeap.remove(needles[i]);
          searchHeap.push(needles[i]);
        }
      },
    },
  ]);
}
