import { Heap } from "../dist/heap-js.umd.js";

const heap = new Heap();

for (let i = 0; i < 100_000; i++) { heap.push(i); }
for (let i = 0; i < 100_000; i++) { heap.pop(); }
