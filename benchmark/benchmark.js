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

for (const n of samples) {
  const heap = new Heap();
  const array = [];
  runBenchmark(`heap vs array: push + pop/unshift ${n}`, [
    {
      name: 'heap ',
      func: function () {
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
        for (let i = 0; i < n; i++) {
          array.push(data[i]);
        }
        array.sort();
        for (let i = 0; i < n; i++) {
          array.unshift();
        }
      },
    },
  ]);
}

for (const n of samples) {
  const heap = new Heap();
  const array = [];
  runBenchmark(`heap vs array: push + peek ${n}`, [
    {
      name: 'heap ',
      func: function () {
        for (let i = 0; i < n; i++) {
          heap.push(data[i]);
        }
        heap.peek();
      },
    },
    {
      name: 'array',
      func: function () {
        for (let i = 0; i < n; i++) {
          array.push(data[i]);
        }
        array.sort();
        array[0];
      },
    },
  ]);
}

for (const n of samples) {
  const heap = new Heap();
  runBenchmark(`heap vs array: init + peek ${n}`, [
    {
      name: 'heap ',
      func: function () {
        heap.init(data.slice(0, n));
        heap.peek();
      },
    },
    {
      name: 'array',
      func: function () {
        const array = data.slice(0, n);
        array.sort();
        array[0];
      },
    },
  ]);
}

for (const n of samples) {
  const heap = new Heap();
  const array = [];
  runBenchmark(`heap vs array: push + top(${n}) of ${N}`, [
    {
      name: 'heap ',
      func: function () {
        for (let i = 0; i < N; i++) {
          heap.push(data[i]);
        }
        heap.top(n);
      },
    },
    {
      name: 'array',
      func: function () {
        for (let i = 0; i < N; i++) {
          array.push(data[i]);
        }
        array.sort();
        array.slice(0, n);
      },
    },
  ]);
}
