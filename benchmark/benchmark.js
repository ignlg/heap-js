const { Heap } = require('../dist/heap-js.umd');

const { filter, Suite } = require('benchmark');

const MIN = 0;
const MAX = 10000;
const N = 100000;

const data = Array(N);
for (let i = 0; i < N; i++) {
  const value = Math.floor(MAX * Math.random() + MIN);
  data[i] = value;
}

console.log(`Data size:   ${N}`);
console.log(`Value range: ${MIN} - ${MAX}`);

const stats = (stats) => {
  return `mean ${(stats[0].mean * 1000).toFixed(5)}ms \
deviation ${(stats[0].deviation * 1000).toFixed(5)}ms`;
};

function onComplete() {
  const fastest = this.filter('fastest');
  const slowest = this.filter('slowest');
  console.log('Fastest is ' + fastest.map('name') + ': ' + stats(fastest.map('stats')));
  console.log('Slowest is ' + slowest.map('name') + ': ' + stats(slowest.map('stats')));
}

console.log('\n--- Heap internal');
const heap = new Heap();
heap.init(data);

for (const n of [N / 1000, N / 100, N / 10, N / 2, N - 1]) {
  console.log(`\n--- top ${n}`);
  const suite = new Suite();
  suite
    .add('_topN', function () {
      heap._topN(n);
    })
    .add('_topHeapN', function () {
      heap._topHeapN(n);
    })
    .add('_topLeafN', function () {
      heap._topLeafN(n);
    })
    .on('complete', onComplete)
    .run({ async: false });
}

console.log('\n--- Heap benchmark');
{
  const heap = new Heap();
  console.time(`heap init ${N}`);
  heap.init(data);
  console.timeEnd(`heap init ${N}`);
}
{
  const heap = new Heap();
  console.time(`heap push ${N}`);
  for (let i = 0; i < N; i++) {
    heap.push(data[i]);
  }
  console.timeEnd(`heap push ${N}`);

  console.time(`heap pop  ${N}`);
  for (let i = 0; i < N; i++) {
    heap.pop();
  }
  console.timeEnd(`heap pop  ${N}`);
}
{
  const heap = new Heap();
  heap.init(data);
  console.time(`heap top  ${N / 10}`);
  heap.top(N / 10);
  console.timeEnd(`heap top  ${N / 10}`);
  console.time(`heap bottom  ${N / 10}`);
  heap.bottom(N / 10);
  console.timeEnd(`heap bottom  ${N / 10}`);
}

console.log('\n--- Heap vs Sorted array');

for (const n of [N / 1000, N / 100, N / 10, N / 2, N]) {
  console.log(`\n> push / pop ${n}`);
  const suite = new Suite();
  const heap = new Heap();
  const array = [];
  suite
    .add('heap', function () {
      for (let i = 0; i < n; i++) {
        heap.push(data[i]);
      }
      for (let i = 0; i < n; i++) {
        heap.pop();
      }
    })
    .add('array', function () {
      for (let i = 0; i < n; i++) {
        array.push(data[i]);
      }
      array.sort();
      for (let i = 0; i < n; i++) {
        array.unshift();
      }
    })
    .on('complete', onComplete)
    .run({ async: false });
}

for (const n of [N / 1000, N / 100, N / 10, N / 2, N]) {
  console.log(`\n> push / peek ${n}`);
  const suite = new Suite();
  const heap = new Heap();
  const array = [];
  suite
    .add('heap', function () {
      for (let i = 0; i < n; i++) {
        heap.push(data[i]);
      }
      heap.peek();
    })
    .add('array', function () {
      for (let i = 0; i < n; i++) {
        array.push(data[i]);
      }
      array.sort();
      array[0];
    })
    .on('complete', onComplete)
    .run({ async: false });
}

for (const n of [N / 1000, N / 100, N / 10, N / 2, N]) {
  console.log(`\n> dump / peek ${n}`);
  const suite = new Suite();
  const heap = new Heap();
  suite
    .add('heap', function () {
      heap.init(data.slice(0, n));
      heap.peek();
    })
    .add('array', function () {
      const array = data.slice(0, n);
      array.sort();
      array[0];
    })
    .on('complete', onComplete)
    .run({ async: false });
}

for (const n of [Math.floor(N / 10), Math.floor(N / 3), Math.floor(N / 2), Math.floor((2 * N) / 3), N - 1]) {
  console.log(`\n> push / top ${n}`);
  const suite = new Suite();
  const heap = new Heap();
  const array = [];
  suite
    .add('heap', function () {
      for (let i = 0; i < N; i++) {
        heap.push(data[i]);
      }
      heap.top(n);
    })
    .add('array', function () {
      for (let i = 0; i < N; i++) {
        array.push(data[i]);
      }
      array.sort();
      array.slice(0, n);
    })
    .on('complete', onComplete)
    .run({ async: false });
}
