import Heap from '../src/Heap';

const MIN = 0;
const MAX = 10000;
const N = 1000000;

const data = Array(N);
for (let i = 0; i < N; i++) {
  const value = Math.floor(MAX * Math.random() + MIN);
  data[i] = value;
}

console.log(`Data size:   ${N}`);
console.log(`Value range: ${MIN} - ${MAX}`);

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
console.log('\n--- Heap vs Sorted array');
console.log('\n> push / pop');
{
  const heap = new Heap();
  console.time(`heap  ${N}`);
  for (let i = 0; i < N; i++) {
    heap.push(data[i]);
  }
  for (let i = 0; i < N; i++) {
    heap.pop();
  }
  console.timeEnd(`heap  ${N}`);

  const array = [];
  console.time(`array ${N}`);
  for (let i = 0; i < N; i++) {
    array.push(data[i]);
  }
  array.sort();
  for (let i = 0; i < N; i++) {
    array.unshift();
  }
  console.timeEnd(`array ${N}`);
}
console.log('\n> push / peek');
{
  const heap = new Heap();
  console.time(`heap  ${N}`);
  for (let i = 0; i < N; i++) {
    heap.push(data[i]);
  }
  heap.peek();
  console.timeEnd(`heap  ${N}`);
  const array = [];
  console.time(`array ${N}`);
  for (let i = 0; i < N; i++) {
    array.push(data[i]);
  }
  array.sort();
  array[0];
  console.timeEnd(`array ${N}`);
}
