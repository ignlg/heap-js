export type AsyncComparator<T> = (a: T, b: T) => Promise<number>;
export type AsyncIsEqual<T> = (e: T, o: T) => Promise<boolean>;

/**
 * Heap
 * @type {Class}
 */
export class HeapAsync<T> implements Iterable<Promise<T>> {
  heapArray: Array<T> = [];
  _limit = 0;

  /**
   * Alias of add
   */
  offer = this.add;

  /**
   * Alias of peek
   */
  element = this.peek;

  /**
   * Alias of pop
   */
  poll = this.pop;

  /**
   * Heap instance constructor.
   * @param  {Function} compare Optional comparison function, defaults to Heap.minComparator<number>
   */
  constructor(public compare: AsyncComparator<T> = HeapAsync.minComparator) {}

  /*
            Static methods
   */

  /**
   * Gets children indices for given index.
   * @param  {Number} idx     Parent index
   * @return {Array(Number)}  Array of children indices
   */
  static getChildrenIndexOf(idx: number): Array<number> {
    return [idx * 2 + 1, idx * 2 + 2];
  }

  /**
   * Gets parent index for given index.
   * @param  {Number} idx  Children index
   * @return {Number | undefined}      Parent index, -1 if idx is 0
   */
  static getParentIndexOf(idx: number): number {
    if (idx <= 0) {
      return -1;
    }
    const whichChildren = idx % 2 ? 1 : 2;
    return Math.floor((idx - whichChildren) / 2);
  }

  /**
   * Gets sibling index for given index.
   * @param  {Number} idx  Children index
   * @return {Number | undefined}      Sibling index, -1 if idx is 0
   */
  static getSiblingIndexOf(idx: number): number {
    if (idx <= 0) {
      return -1;
    }
    const whichChildren = idx % 2 ? 1 : -1;
    return idx + whichChildren;
  }

  /**
   * Min heap comparison function, default.
   * @param  {any} a     First element
   * @param  {any} b     Second element
   * @return {Number}    0 if they're equal, positive if `a` goes up, negative if `b` goes up
   */
  static async minComparator<N>(a: N, b: N): Promise<number> {
    if (a > b) {
      return 1;
    } else if (a < b) {
      return -1;
    } else {
      return 0;
    }
  }

  /**
   * Max heap comparison function.
   * @param  {any} a     First element
   * @param  {any} b     Second element
   * @return {Number}    0 if they're equal, positive if `a` goes up, negative if `b` goes up
   */
  static async maxComparator<N>(a: N, b: N): Promise<number> {
    if (b > a) {
      return 1;
    } else if (b < a) {
      return -1;
    } else {
      return 0;
    }
  }

  /**
   * Min number heap comparison function, default.
   * @param  {Number} a     First element
   * @param  {Number} b     Second element
   * @return {Number}    0 if they're equal, positive if `a` goes up, negative if `b` goes up
   */
  static async minComparatorNumber(a: number, b: number): Promise<number> {
    return a - b;
  }

  /**
   * Max number heap comparison function.
   * @param  {Number} a     First element
   * @param  {Number} b     Second element
   * @return {Number}    0 if they're equal, positive if `a` goes up, negative if `b` goes up
   */
  static async maxComparatorNumber(a: number, b: number): Promise<number> {
    return b - a;
  }

  /**
   * Default equality function.
   * @param  {any} a    First element
   * @param  {any} b    Second element
   * @return {Boolean}  True if equal, false otherwise
   */
  static async defaultIsEqual<N>(a: N, b: N): Promise<boolean> {
    return a === b;
  }

  /**
   * Prints a heap.
   * @param  {HeapAsync} heap Heap to be printed
   * @returns {String}
   */
  static print<N>(heap: HeapAsync<N>): string {
    function deep(i: number) {
      const pi = HeapAsync.getParentIndexOf(i);
      return Math.floor(Math.log2(pi + 1));
    }

    function repeat(str: string, times: number) {
      let out = '';
      for (; times > 0; --times) {
        out += str;
      }
      return out;
    }

    let node = 0;
    const lines: Array<Array<string>> = [];
    const maxLines = deep(heap.length - 1) + 2;
    let maxLength = 0;

    while (node < heap.length) {
      let i = deep(node) + 1;
      if (node === 0) {
        i = 0;
      }
      // Text representation
      const nodeText = String(heap.get(node));
      if (nodeText.length > maxLength) {
        maxLength = nodeText.length;
      }
      // Add to line
      lines[i] = lines[i] || [];
      lines[i].push(nodeText);
      node += 1;
    }

    return lines
      .map((line, i) => {
        const times = Math.pow(2, maxLines - i) - 1;
        return (
          repeat(' ', Math.floor(times / 2) * maxLength) +
          line
            .map((el) => {
              // centered
              const half = (maxLength - el.length) / 2;
              return repeat(' ', Math.ceil(half)) + el + repeat(' ', Math.floor(half));
            })
            .join(repeat(' ', times * maxLength))
        );
      })
      .join('\n');
  }

  /*
            Python style
   */
  /**
   * Converts an array into an array-heap, in place
   * @param  {Array}    arr      Array to be modified
   * @param  {Function} compare  Optional compare function
   * @return {HeapAsync}              For convenience, it returns a Heap instance
   */
  static async heapify<N>(arr: Array<N>, compare?: AsyncComparator<N>): Promise<HeapAsync<N>> {
    const heap = new HeapAsync(compare);
    heap.heapArray = arr;
    await heap.init();
    return heap;
  }
  /**
   * Extract the peek of an array-heap
   * @param  {Array}    heapArr  Array to be modified, should be a heap
   * @param  {Function} compare  Optional compare function
   * @return {any}               Returns the extracted peek
   */
  static heappop<N>(heapArr: Array<N>, compare?: AsyncComparator<N>): Promise<N | undefined> {
    const heap = new HeapAsync(compare);
    heap.heapArray = heapArr;
    return heap.pop();
  }
  /**
   * Pushes a item into an array-heap
   * @param  {Array}    heapArr  Array to be modified, should be a heap
   * @param  {any}      item     Item to push
   * @param  {Function} compare  Optional compare function
   */
  static async heappush<N>(heapArr: Array<N>, item: N, compare?: AsyncComparator<N>): Promise<void> {
    const heap = new HeapAsync(compare);
    heap.heapArray = heapArr;
    await heap.push(item);
  }
  /**
   * Push followed by pop, faster
   * @param  {Array}    heapArr  Array to be modified, should be a heap
   * @param  {any}      item     Item to push
   * @param  {Function} compare  Optional compare function
   * @return {any}               Returns the extracted peek
   */
  static heappushpop<N>(heapArr: Array<N>, item: N, compare?: AsyncComparator<N>): Promise<N> {
    const heap = new HeapAsync(compare);
    heap.heapArray = heapArr;
    return heap.pushpop(item);
  }
  /**
   * Replace peek with item
   * @param  {Array}    heapArr  Array to be modified, should be a heap
   * @param  {any}      item     Item as replacement
   * @param  {Function} compare  Optional compare function
   * @return {any}               Returns the extracted peek
   */
  static heapreplace<N>(heapArr: Array<N>, item: N, compare?: AsyncComparator<N>): Promise<N> {
    const heap = new HeapAsync(compare);
    heap.heapArray = heapArr;
    return heap.replace(item);
  }

  /**
   * Return the `n` most valuable elements of a heap-like Array
   * @param  {Array}    heapArr  Array, should be an array-heap
   * @param  {number}   n        Max number of elements
   * @param  {Function} compare  Optional compare function
   * @return {any}               Elements
   */
  static heaptop<N>(heapArr: Array<N>, n = 1, compare?: AsyncComparator<N>): Promise<Array<N>> {
    const heap = new HeapAsync(compare);
    heap.heapArray = heapArr;
    return heap.top(n);
  }

  /**
   * Return the `n` least valuable elements of a heap-like Array
   * @param  {Array}    heapArr  Array, should be an array-heap
   * @param  {number}   n        Max number of elements
   * @param  {Function} compare  Optional compare function
   * @return {any}               Elements
   */
  static heapbottom<N>(heapArr: Array<N>, n = 1, compare?: AsyncComparator<N>): Promise<Array<N>> {
    const heap = new HeapAsync(compare);
    heap.heapArray = heapArr;
    return heap.bottom(n);
  }

  /**
   * Return the `n` most valuable elements of an iterable
   * @param  {number}   n        Max number of elements
   * @param  {Iterable} Iterable Iterable list of elements
   * @param  {Function} compare  Optional compare function
   * @return {any}               Elements
   */
  static async nlargest<N>(
    n: number,
    iterable: Iterable<N>,
    compare?: AsyncComparator<N>
  ): Promise<Array<N>> {
    const heap = new HeapAsync(compare);
    heap.heapArray = [...iterable];
    await heap.init();
    return heap.top(n);
  }

  /**
   * Return the `n` least valuable elements of an iterable
   * @param  {number}   n        Max number of elements
   * @param  {Iterable} Iterable Iterable list of elements
   * @param  {Function} compare  Optional compare function
   * @return {any}               Elements
   */
  static async nsmallest<N>(
    n: number,
    iterable: Iterable<N>,
    compare?: AsyncComparator<N>
  ): Promise<Array<N>> {
    const heap = new HeapAsync(compare);
    heap.heapArray = [...iterable];
    await heap.init();
    return heap.bottom(n);
  }

  /*
            Instance methods
   */

  /**
   * Adds an element to the heap. Aliases: `offer`.
   * Same as: push(element)
   * @param {any} element Element to be added
   * @return {Boolean} true
   */
  async add(element: T): Promise<boolean> {
    await this._sortNodeUp(this.heapArray.push(element) - 1);
    this._applyLimit();
    return true;
  }

  /**
   * Adds an array of elements to the heap.
   * Similar as: push(element, element, ...).
   * @param {Array} elements Elements to be added
   * @return {Boolean} true
   */
  async addAll(elements: Array<T>): Promise<boolean> {
    let i = this.length;
    this.heapArray.push(...elements);
    for (const l = this.length; i < l; ++i) {
      await this._sortNodeUp(i);
    }
    this._applyLimit();
    return true;
  }

  /**
   * Return the bottom (lowest value) N elements of the heap.
   *
   * @param  {Number} n  Number of elements.
   * @return {Array}     Array of length <= N.
   */
  async bottom(n = 1): Promise<Array<T>> {
    if (this.heapArray.length === 0 || n <= 0) {
      // Nothing to do
      return [];
    } else if (this.heapArray.length === 1) {
      // Just the peek
      return [this.heapArray[0]];
    } else if (n >= this.heapArray.length) {
      // The whole heap
      return [...this.heapArray];
    } else {
      // Some elements
      return this._bottomN_push(~~n);
    }
  }

  /**
   * Check if the heap is sorted, useful for testing purposes.
   * @return {Undefined | Element}  Returns an element if something wrong is found, otherwise it's undefined
   */
  async check(): Promise<T | undefined> {
    for (let j = 0; j < this.heapArray.length; ++j) {
      const el = this.heapArray[j];
      const children = this.getChildrenOf(j);
      for (const ch of children) {
        if ((await this.compare(el, ch)) > 0) {
          return el;
        }
      }
    }
  }

  /**
   * Remove all of the elements from this heap.
   */
  clear(): void {
    this.heapArray = [];
  }

  /**
   * Clone this heap
   * @return {HeapAsync}
   */
  clone(): HeapAsync<T> {
    const cloned = new HeapAsync<T>(this.comparator());
    cloned.heapArray = this.toArray();
    cloned._limit = this._limit;
    return cloned;
  }

  /**
   * Returns the comparison function.
   * @return {Function}
   */
  comparator(): AsyncComparator<T> {
    return this.compare;
  }

  /**
   * Returns true if this queue contains the specified element.
   * @param  {any}      o   Element to be found
   * @param  {Function} fn  Optional comparison function, receives (element, needle)
   * @return {Boolean}
   */
  async contains(o: T, fn: AsyncIsEqual<T> = HeapAsync.defaultIsEqual): Promise<boolean> {
    for (const el of this.heapArray) {
      if (await fn(el, o)) {
        return true;
      }
    }
    return false;
  }

  /**
   * Initialise a heap, sorting nodes
   * @param  {Array} array Optional initial state array
   */
  async init(array?: Array<T>): Promise<void> {
    if (array) {
      this.heapArray = [...array];
    }
    for (let i = Math.floor(this.heapArray.length); i >= 0; --i) {
      await this._sortNodeDown(i);
    }
    this._applyLimit();
  }

  /**
   * Test if the heap has no elements.
   * @return {Boolean} True if no elements on the heap
   */
  isEmpty(): boolean {
    return this.length === 0;
  }

  /**
   * Get the leafs of the tree (no children nodes)
   */
  leafs(): Array<T> {
    if (this.heapArray.length === 0) {
      return [];
    }
    const pi = HeapAsync.getParentIndexOf(this.heapArray.length - 1);
    return this.heapArray.slice(pi + 1);
  }

  /**
   * Length of the heap.
   * @return {Number}
   */
  get length(): number {
    return this.heapArray.length;
  }

  /**
   * Get length limit of the heap.
   * @return {Number}
   */
  get limit(): number {
    return this._limit;
  }

  /**
   * Set length limit of the heap.
   * @return {Number}
   */
  set limit(_l: number) {
    this._limit = ~~_l;
    this._applyLimit();
  }

  /**
   * Top node. Aliases: `element`.
   * Same as: `top(1)[0]`
   * @return {any} Top node
   */
  peek(): T | undefined {
    return this.heapArray[0];
  }

  /**
   * Extract the top node (root). Aliases: `poll`.
   * @return {any} Extracted top node, undefined if empty
   */
  async pop(): Promise<T | undefined> {
    const last = this.heapArray.pop();
    if (this.length > 0 && last !== undefined) {
      return this.replace(last);
    }
    return last;
  }

  /**
   * Pushes element(s) to the heap.
   * @param  {...any} elements Elements to insert
   * @return {Boolean} True if elements are present
   */
  async push(...elements: Array<T>): Promise<boolean> {
    if (elements.length < 1) {
      return false;
    } else if (elements.length === 1) {
      return this.add(elements[0]);
    } else {
      return this.addAll(elements);
    }
  }

  /**
   * Same as push & pop in sequence, but faster
   * @param  {any} element Element to insert
   * @return {any}  Extracted top node
   */
  async pushpop(element: T): Promise<T> {
    if ((await this.compare(this.heapArray[0], element)) < 0) {
      [element, this.heapArray[0]] = [this.heapArray[0], element];
      await this._sortNodeDown(0);
    }
    return element;
  }

  /**
   * Remove an element from the heap.
   * @param  {any}   o      Element to be found
   * @param  {Function} fn  Optional function to compare
   * @return {Boolean}      True if the heap was modified
   */
  async remove(o?: T, fn: AsyncIsEqual<T> = HeapAsync.defaultIsEqual): Promise<boolean> {
    if (!this.heapArray.length) return false;
    if (o === undefined) {
      await this.pop();
      return true;
    }
    const queue = [0];
    while (queue.length) {
      const idx = queue.shift() as number;
      if (await fn(this.heapArray[idx], o)) {
        if (idx === 0) {
          await this.pop();
        } else if (idx === this.heapArray.length - 1) {
          this.heapArray.pop();
        } else {
          this.heapArray.splice(idx, 1, this.heapArray.pop() as T);
          await this._sortNodeUp(idx);
          await this._sortNodeDown(idx);
        }
        return true;
      } else {
        const children = HeapAsync.getChildrenIndexOf(idx).filter((c) => c < this.heapArray.length);
        queue.push(...children);
      }
    }
    return false;
  }

  /**
   * Pop the current peek value, and add the new item.
   * @param  {any} element  Element to replace peek
   * @return {any}         Old peek
   */
  async replace(element: T): Promise<T> {
    const peek = this.heapArray[0];
    this.heapArray[0] = element;
    await this._sortNodeDown(0);
    return peek;
  }

  /**
   * Size of the heap
   * @return {Number}
   */
  size(): number {
    return this.length;
  }

  /**
   * Return the top (highest value) N elements of the heap.
   *
   * @param  {Number} n  Number of elements.
   * @return {Array}    Array of length <= N.
   */
  async top(n = 1): Promise<Array<T>> {
    if (this.heapArray.length === 0 || n <= 0) {
      // Nothing to do
      return [];
    } else if (this.heapArray.length === 1 || n === 1) {
      // Just the peek
      return [this.heapArray[0]];
    } else if (n >= this.heapArray.length) {
      // The whole peek
      return [...this.heapArray];
    } else {
      // Some elements
      return this._topN_push(~~n);
    }
  }

  /**
   * Clone the heap's internal array
   * @return {Array}
   */
  toArray(): Array<T> {
    return [...this.heapArray];
  }

  /**
   * String output, call to Array.prototype.toString()
   * @return {String}
   */
  toString(): string {
    return this.heapArray.toString();
  }

  /**
   * Get the element at the given index.
   * @param  {Number} i Index to get
   * @return {any}       Element at that index
   */
  get(i: number): T {
    return this.heapArray[i];
  }

  /**
   * Get the elements of these node's children
   * @param  {Number} idx Node index
   * @return {Array(any)}  Children elements
   */
  getChildrenOf(idx: number): Array<T> {
    return HeapAsync.getChildrenIndexOf(idx)
      .map((i) => this.heapArray[i])
      .filter((e) => e !== undefined);
  }

  /**
   * Get the element of this node's parent
   * @param  {Number} idx Node index
   * @return {any}     Parent element
   */
  getParentOf(idx: number): T | undefined {
    const pi = HeapAsync.getParentIndexOf(idx);
    return this.heapArray[pi];
  }

  /**
   * Iterator interface
   */
  *[Symbol.iterator](): Iterator<Promise<T>> {
    while (this.length) {
      yield this.pop() as Promise<T>;
    }
  }

  /**
   * Returns an iterator. To comply with Java interface.
   */
  iterator(): Iterable<Promise<T>> {
    return this;
  }

  /**
   * Limit heap size if needed
   */
  _applyLimit(): void {
    if (this._limit && this._limit < this.heapArray.length) {
      let rm = this.heapArray.length - this._limit;
      // It's much faster than splice
      while (rm) {
        this.heapArray.pop();
        --rm;
      }
    }
  }

  /**
   * Return the bottom (lowest value) N elements of the heap, without corner cases, unsorted
   *
   * @param  {Number} n  Number of elements.
   * @return {Array}     Array of length <= N.
   */
  async _bottomN_push(n: number): Promise<Array<T>> {
    // Use an inverted heap
    const bottomHeap = new HeapAsync(this.compare);
    bottomHeap.limit = n;
    bottomHeap.heapArray = this.heapArray.slice(-n);
    await bottomHeap.init();
    const startAt = this.heapArray.length - 1 - n;
    const parentStartAt = HeapAsync.getParentIndexOf(startAt);
    const indices = [];
    for (let i = startAt; i > parentStartAt; --i) {
      indices.push(i);
    }
    const arr = this.heapArray;
    while (indices.length) {
      const i = indices.shift() as number;
      if ((await this.compare(arr[i], bottomHeap.peek() as T)) > 0) {
        await bottomHeap.replace(arr[i]);
        if (i % 2) {
          indices.push(HeapAsync.getParentIndexOf(i));
        }
      }
    }
    return bottomHeap.toArray();
  }

  /**
   * Returns the inverse to the comparison function.
   * @return {Number}
   */
  _invertedCompare = (a: T, b: T): Promise<number> => {
    return this.compare(a, b).then((res) => -1 * res);
  };

  /**
   * Move a node to a new index, switching places
   * @param  {Number} j First node index
   * @param  {Number} k Another node index
   */
  _moveNode(j: number, k: number): void {
    [this.heapArray[j], this.heapArray[k]] = [this.heapArray[k], this.heapArray[j]];
  }

  /**
   * Move a node down the tree (to the leaves) to find a place where the heap is sorted.
   * @param  {Number} i Index of the node
   */
  async _sortNodeDown(i: number): Promise<void> {
    const { length } = this.heapArray;
    do {
      const left = 2 * i + 1;
      const right = left + 1;
      let best = i;
      if (left < length && (await this.compare(this.heapArray[left], this.heapArray[best])) < 0) {
        best = left;
      }
      if (right < length && (await this.compare(this.heapArray[right], this.heapArray[best])) < 0) {
        best = right;
      }
      if (best === i) break;
      this._moveNode(i, best);
      i = best;
    } while (true);
  }

  /**
   * Move a node up the tree (to the root) to find a place where the heap is sorted.
   * @param  {Number} i Index of the node
   */
  async _sortNodeUp(i: number): Promise<void> {
    while (i > 0) {
      const pi = HeapAsync.getParentIndexOf(i);
      if ((await this.compare(this.heapArray[i], this.heapArray[pi])) < 0) {
        this._moveNode(i, pi);
        i = pi;
      } else break;
    }
  }

  /**
   * Return the top (highest value) N elements of the heap, without corner cases, unsorted
   * Implementation: push.
   *
   * @param  {Number} n  Number of elements.
   * @return {Array}     Array of length <= N.
   */
  async _topN_push(n: number): Promise<Array<T>> {
    // Use an inverted heap
    const topHeap = new HeapAsync(this._invertedCompare);
    topHeap.limit = n;
    const indices = [0];
    const arr = this.heapArray;
    while (indices.length) {
      const i = indices.shift() as number;
      if (i < arr.length) {
        if (topHeap.length < n) {
          await topHeap.push(arr[i]);
          indices.push(...HeapAsync.getChildrenIndexOf(i));
        } else if ((await this.compare(arr[i], topHeap.peek() as T)) < 0) {
          await topHeap.replace(arr[i]);
          indices.push(...HeapAsync.getChildrenIndexOf(i));
        }
      }
    }
    return topHeap.toArray();
  }

  /**
   * Return the top (highest value) N elements of the heap, without corner cases, unsorted
   * Implementation: init + push.
   *
   * @param  {Number} n  Number of elements.
   * @return {Array}     Array of length <= N.
   */
  async _topN_fill(n: number): Promise<Array<T>> {
    // Use an inverted heap
    const { heapArray } = this;
    const topHeap = new HeapAsync(this._invertedCompare);
    topHeap.limit = n;
    topHeap.heapArray = heapArray.slice(0, n);
    await topHeap.init();
    const branch = HeapAsync.getParentIndexOf(n - 1) + 1;
    const indices = [];
    for (let i = branch; i < n; ++i) {
      indices.push(...HeapAsync.getChildrenIndexOf(i).filter((l) => l < heapArray.length));
    }
    if ((n - 1) % 2) {
      indices.push(n);
    }
    while (indices.length) {
      const i = indices.shift() as number;
      if (i < heapArray.length) {
        if ((await this.compare(heapArray[i], topHeap.peek() as T)) < 0) {
          await topHeap.replace(heapArray[i]);
          indices.push(...HeapAsync.getChildrenIndexOf(i));
        }
      }
    }
    return topHeap.toArray();
  }

  /**
   * Return the top (highest value) N elements of the heap, without corner cases, unsorted
   * Implementation: heap.
   *
   * @param  {Number} n  Number of elements.
   * @return {Array}     Array of length <= N.
   */
  async _topN_heap(n: number): Promise<Array<T>> {
    const topHeap = this.clone();
    const result: Array<T> = [];
    for (let i = 0; i < n; ++i) {
      result.push((await topHeap.pop()) as T);
    }
    return result;
  }

  /**
   * Return index of the top element
   * @param list
   */
  async _topIdxOf(list: Array<T>): Promise<number> {
    if (!list.length) {
      return -1;
    }
    let idx = 0;
    let top = list[idx];
    for (let i = 1; i < list.length; ++i) {
      const comp = await this.compare(list[i], top);
      if (comp < 0) {
        idx = i;
        top = list[i];
      }
    }
    return idx;
  }

  /**
   * Return the top element
   * @param list
   */
  async _topOf(...list: Array<T>): Promise<T | undefined> {
    const heap = new HeapAsync(this.compare);
    await heap.init(list);
    return heap.peek();
  }
}

export default HeapAsync;
