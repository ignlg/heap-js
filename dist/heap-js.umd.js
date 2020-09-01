(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.heap = {}));
}(this, (function (exports) { 'use strict';

    var __generator = (undefined && undefined.__generator) || function (thisArg, body) {
        var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
        return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
        function verb(n) { return function (v) { return step([n, v]); }; }
        function step(op) {
            if (f) throw new TypeError("Generator is already executing.");
            while (_) try {
                if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
                if (y = 0, t) op = [op[0] & 2, t.value];
                switch (op[0]) {
                    case 0: case 1: t = op; break;
                    case 4: _.label++; return { value: op[1], done: false };
                    case 5: _.label++; y = op[1]; op = [0]; continue;
                    case 7: op = _.ops.pop(); _.trys.pop(); continue;
                    default:
                        if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                        if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                        if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                        if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                        if (t[2]) _.ops.pop();
                        _.trys.pop(); continue;
                }
                op = body.call(thisArg, _);
            } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
            if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
        }
    };
    var __read = (undefined && undefined.__read) || function (o, n) {
        var m = typeof Symbol === "function" && o[Symbol.iterator];
        if (!m) return o;
        var i = m.call(o), r, ar = [], e;
        try {
            while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
        }
        catch (error) { e = { error: error }; }
        finally {
            try {
                if (r && !r.done && (m = i["return"])) m.call(i);
            }
            finally { if (e) throw e.error; }
        }
        return ar;
    };
    var __spread = (undefined && undefined.__spread) || function () {
        for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));
        return ar;
    };
    var toInt = function (n) { return ~~n; };
    /**
     * Heap
     * @type {Class}
     */
    var Heap = /** @class */ (function () {
        /**
         * Heap instance constructor.
         * @param  {Function} compare Optional comparison function, defaults to Heap.minComparator<number>
         */
        function Heap(compare) {
            var _this = this;
            if (compare === void 0) { compare = Heap.minComparator; }
            this.compare = compare;
            this.heapArray = [];
            this._limit = 0;
            /**
             * Alias of add
             */
            this.offer = this.add;
            /**
             * Alias of peek
             */
            this.element = this.peek;
            /**
             * Alias of pop
             */
            this.poll = this.pop;
            /**
             * Returns the inverse to the comparison function.
             * @return {Function}
             */
            this._invertedCompare = function (a, b) {
                return -1 * _this.compare(a, b);
            };
        }
        /*
                  Static methods
         */
        /**
         * Gets children indices for given index.
         * @param  {Number} idx     Parent index
         * @return {Array(Number)}  Array of children indices
         */
        Heap.getChildrenIndexOf = function (idx) {
            return [idx * 2 + 1, idx * 2 + 2];
        };
        /**
         * Gets parent index for given index.
         * @param  {Number} idx  Children index
         * @return {Number | undefined}      Parent index, -1 if idx is 0
         */
        Heap.getParentIndexOf = function (idx) {
            if (idx <= 0) {
                return -1;
            }
            var whichChildren = idx % 2 ? 1 : 2;
            return Math.floor((idx - whichChildren) / 2);
        };
        /**
         * Gets sibling index for given index.
         * @param  {Number} idx  Children index
         * @return {Number | undefined}      Sibling index, -1 if idx is 0
         */
        Heap.getSiblingIndexOf = function (idx) {
            if (idx <= 0) {
                return -1;
            }
            var whichChildren = idx % 2 ? 1 : -1;
            return idx + whichChildren;
        };
        /**
         * Min heap comparison function, default.
         * @param  {any} a     First element
         * @param  {any} b     Second element
         * @return {Number}    0 if they're equal, positive if `a` goes up, negative if `b` goes up
         */
        Heap.minComparator = function (a, b) {
            if (a > b) {
                return 1;
            }
            else if (a < b) {
                return -1;
            }
            else {
                return 0;
            }
        };
        /**
         * Max heap comparison function.
         * @param  {any} a     First element
         * @param  {any} b     Second element
         * @return {Number}    0 if they're equal, positive if `a` goes up, negative if `b` goes up
         */
        Heap.maxComparator = function (a, b) {
            if (b > a) {
                return 1;
            }
            else if (b < a) {
                return -1;
            }
            else {
                return 0;
            }
        };
        /**
         * Min number heap comparison function, default.
         * @param  {Number} a     First element
         * @param  {Number} b     Second element
         * @return {Number}    0 if they're equal, positive if `a` goes up, negative if `b` goes up
         */
        Heap.minComparatorNumber = function (a, b) {
            return a - b;
        };
        /**
         * Max number heap comparison function.
         * @param  {Number} a     First element
         * @param  {Number} b     Second element
         * @return {Number}    0 if they're equal, positive if `a` goes up, negative if `b` goes up
         */
        Heap.maxComparatorNumber = function (a, b) {
            return b - a;
        };
        /**
         * Default equality function.
         * @param  {any} a    First element
         * @param  {any} b    Second element
         * @return {Boolean}  True if equal, false otherwise
         */
        Heap.defaultIsEqual = function (a, b) {
            return a === b;
        };
        /**
         * Prints a heap.
         * @param  {Heap} heap Heap to be printed
         * @returns {String}
         */
        Heap.print = function (heap) {
            function deep(i) {
                var pi = Heap.getParentIndexOf(i);
                return Math.floor(Math.log2(pi + 1));
            }
            function repeat(str, times) {
                var out = '';
                for (; times > 0; --times) {
                    out += str;
                }
                return out;
            }
            var node = 0;
            var lines = [];
            var maxLines = deep(heap.length - 1) + 2;
            var maxLength = 0;
            while (node < heap.length) {
                var i = deep(node) + 1;
                if (node === 0) {
                    i = 0;
                }
                // Text representation
                var nodeText = String(heap.get(node));
                if (nodeText.length > maxLength) {
                    maxLength = nodeText.length;
                }
                // Add to line
                lines[i] = lines[i] || [];
                lines[i].push(nodeText);
                node += 1;
            }
            return lines
                .map(function (line, i) {
                var times = Math.pow(2, maxLines - i) - 1;
                return (repeat(' ', Math.floor(times / 2) * maxLength) +
                    line
                        .map(function (el) {
                        // centered
                        var half = (maxLength - el.length) / 2;
                        return repeat(' ', Math.ceil(half)) + el + repeat(' ', Math.floor(half));
                    })
                        .join(repeat(' ', times * maxLength)));
            })
                .join('\n');
        };
        /*
                  Python style
         */
        /**
         * Converts an array into an array-heap, in place
         * @param  {Array}    arr      Array to be modified
         * @param  {Function} compare  Optional compare function
         * @return {Heap}              For convenience, it returns a Heap instance
         */
        Heap.heapify = function (arr, compare) {
            var heap = new Heap(compare);
            heap.heapArray = arr;
            heap.init();
            return heap;
        };
        /**
         * Extract the peek of an array-heap
         * @param  {Array}    heapArr  Array to be modified, should be a heap
         * @param  {Function} compare  Optional compare function
         * @return {any}               Returns the extracted peek
         */
        Heap.heappop = function (heapArr, compare) {
            var heap = new Heap(compare);
            heap.heapArray = heapArr;
            return heap.pop();
        };
        /**
         * Pushes a item into an array-heap
         * @param  {Array}    heapArr  Array to be modified, should be a heap
         * @param  {any}      item     Item to push
         * @param  {Function} compare  Optional compare function
         */
        Heap.heappush = function (heapArr, item, compare) {
            var heap = new Heap(compare);
            heap.heapArray = heapArr;
            heap.push(item);
        };
        /**
         * Push followed by pop, faster
         * @param  {Array}    heapArr  Array to be modified, should be a heap
         * @param  {any}      item     Item to push
         * @param  {Function} compare  Optional compare function
         * @return {any}               Returns the extracted peek
         */
        Heap.heappushpop = function (heapArr, item, compare) {
            var heap = new Heap(compare);
            heap.heapArray = heapArr;
            return heap.pushpop(item);
        };
        /**
         * Replace peek with item
         * @param  {Array}    heapArr  Array to be modified, should be a heap
         * @param  {any}      item     Item as replacement
         * @param  {Function} compare  Optional compare function
         * @return {any}               Returns the extracted peek
         */
        Heap.heapreplace = function (heapArr, item, compare) {
            var heap = new Heap(compare);
            heap.heapArray = heapArr;
            return heap.replace(item);
        };
        /**
         * Return the `n` most valuable elements of a heap-like Array
         * @param  {Array}    heapArr  Array, should be an array-heap
         * @param  {number}   n        Max number of elements
         * @param  {Function} compare  Optional compare function
         * @return {any}               Elements
         */
        Heap.heaptop = function (heapArr, n, compare) {
            if (n === void 0) { n = 1; }
            var heap = new Heap(compare);
            heap.heapArray = heapArr;
            return heap.top(n);
        };
        /**
         * Return the `n` least valuable elements of a heap-like Array
         * @param  {Array}    heapArr  Array, should be an array-heap
         * @param  {number}   n        Max number of elements
         * @param  {Function} compare  Optional compare function
         * @return {any}               Elements
         */
        Heap.heapbottom = function (heapArr, n, compare) {
            if (n === void 0) { n = 1; }
            var heap = new Heap(compare);
            heap.heapArray = heapArr;
            return heap.bottom(n);
        };
        /**
         * Return the `n` most valuable elements of an iterable
         * @param  {number}   n        Max number of elements
         * @param  {Iterable} Iterable Iterable list of elements
         * @param  {Function} compare  Optional compare function
         * @return {any}               Elements
         */
        Heap.nlargest = function (n, iterable, compare) {
            var heap = new Heap(compare);
            heap.heapArray = __spread(iterable);
            heap.init();
            return heap.top(n);
        };
        /**
         * Return the `n` least valuable elements of an iterable
         * @param  {number}   n        Max number of elements
         * @param  {Iterable} Iterable Iterable list of elements
         * @param  {Function} compare  Optional compare function
         * @return {any}               Elements
         */
        Heap.nsmallest = function (n, iterable, compare) {
            var heap = new Heap(compare);
            heap.heapArray = __spread(iterable);
            heap.init();
            return heap.bottom(n);
        };
        /*
                  Instance methods
         */
        /**
         * Adds an element to the heap. Aliases: `offer`.
         * Same as: push(element)
         * @param {any} element Element to be added
         * @return {Boolean} true
         */
        Heap.prototype.add = function (element) {
            this._sortNodeUp(this.heapArray.push(element) - 1);
            this._applyLimit();
            return true;
        };
        /**
         * Adds an array of elements to the heap.
         * Similar as: push(element, element, ...).
         * @param {Array} elements Elements to be added
         * @return {Boolean} true
         */
        Heap.prototype.addAll = function (elements) {
            var _a;
            var i = this.length;
            (_a = this.heapArray).push.apply(_a, __spread(elements));
            for (var l = this.length; i < l; ++i) {
                this._sortNodeUp(i);
            }
            this._applyLimit();
            return true;
        };
        /**
         * Return the bottom (lowest value) N elements of the heap.
         *
         * @param  {Number} n  Number of elements.
         * @return {Array}     Array of length <= N.
         */
        Heap.prototype.bottom = function (n) {
            if (n === void 0) { n = 1; }
            if (this.heapArray.length === 0 || n <= 0) {
                // Nothing to do
                return [];
            }
            else if (this.heapArray.length === 1) {
                // Just the peek
                return [this.heapArray[0]];
            }
            else if (n >= this.heapArray.length) {
                // The whole heap
                return __spread(this.heapArray);
            }
            else {
                // Some elements
                var result = this._bottomN_push(~~n);
                return result;
            }
        };
        /**
         * Check if the heap is sorted, useful for testing purposes.
         * @return {Undefined | Element}  Returns an element if something wrong is found, otherwise it's undefined
         */
        Heap.prototype.check = function () {
            var _this = this;
            return this.heapArray.find(function (el, j) { return !!_this.getChildrenOf(j).find(function (ch) { return _this.compare(el, ch) > 0; }); });
        };
        /**
         * Remove all of the elements from this heap.
         */
        Heap.prototype.clear = function () {
            this.heapArray = [];
        };
        /**
         * Clone this heap
         * @return {Heap}
         */
        Heap.prototype.clone = function () {
            var cloned = new Heap(this.comparator());
            cloned.heapArray = this.toArray();
            cloned._limit = this._limit;
            return cloned;
        };
        /**
         * Returns the comparison function.
         * @return {Function}
         */
        Heap.prototype.comparator = function () {
            return this.compare;
        };
        /**
         * Returns true if this queue contains the specified element.
         * @param  {any}      o   Element to be found
         * @param  {Function} fn  Optional comparison function, receives (element, needle)
         * @return {Boolean}
         */
        Heap.prototype.contains = function (o, fn) {
            if (fn === void 0) { fn = Heap.defaultIsEqual; }
            return this.heapArray.findIndex(function (el) { return fn(el, o); }) >= 0;
        };
        /**
         * Initialise a heap, sorting nodes
         * @param  {Array} array Optional initial state array
         */
        Heap.prototype.init = function (array) {
            if (array) {
                this.heapArray = __spread(array);
            }
            for (var i = Math.floor(this.heapArray.length); i >= 0; --i) {
                this._sortNodeDown(i);
            }
            this._applyLimit();
        };
        /**
         * Test if the heap has no elements.
         * @return {Boolean} True if no elements on the heap
         */
        Heap.prototype.isEmpty = function () {
            return this.length === 0;
        };
        /**
         * Get the leafs of the tree (no children nodes)
         */
        Heap.prototype.leafs = function () {
            if (this.heapArray.length === 0) {
                return [];
            }
            var pi = Heap.getParentIndexOf(this.heapArray.length - 1);
            return this.heapArray.slice(pi + 1);
        };
        Object.defineProperty(Heap.prototype, "length", {
            /**
             * Length of the heap.
             * @return {Number}
             */
            get: function () {
                return this.heapArray.length;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Heap.prototype, "limit", {
            /**
             * Get length limit of the heap.
             * @return {Number}
             */
            get: function () {
                return this._limit;
            },
            /**
             * Set length limit of the heap.
             * @return {Number}
             */
            set: function (_l) {
                this._limit = ~~_l;
                this._applyLimit();
            },
            enumerable: false,
            configurable: true
        });
        /**
         * Top node. Aliases: `element`.
         * Same as: `top(1)[0]`
         * @return {any} Top node
         */
        Heap.prototype.peek = function () {
            return this.heapArray[0];
        };
        /**
         * Extract the top node (root). Aliases: `poll`.
         * @return {any} Extracted top node, undefined if empty
         */
        Heap.prototype.pop = function () {
            var last = this.heapArray.pop();
            if (this.length > 0 && last !== undefined) {
                return this.replace(last);
            }
            return last;
        };
        /**
         * Pushes element(s) to the heap.
         * @param  {...any} elements Elements to insert
         * @return {Boolean} True if elements are present
         */
        Heap.prototype.push = function () {
            var elements = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                elements[_i] = arguments[_i];
            }
            if (elements.length < 1) {
                return false;
            }
            else if (elements.length === 1) {
                return this.add(elements[0]);
            }
            else {
                return this.addAll(elements);
            }
        };
        /**
         * Same as push & pop in sequence, but faster
         * @param  {any} element Element to insert
         * @return {any}  Extracted top node
         */
        Heap.prototype.pushpop = function (element) {
            var _a;
            if (this.compare(this.heapArray[0], element) < 0) {
                _a = __read([this.heapArray[0], element], 2), element = _a[0], this.heapArray[0] = _a[1];
                this._sortNodeDown(0);
            }
            return element;
        };
        /**
         * Remove an element from the heap.
         * @param  {any}   o      Element to be found
         * @param  {Function} fn  Optional function to compare
         * @return {Boolean}      True if the heap was modified
         */
        Heap.prototype.remove = function (o, fn) {
            if (fn === void 0) { fn = Heap.defaultIsEqual; }
            if (this.length > 0) {
                if (o === undefined) {
                    this.pop();
                    return true;
                }
                else {
                    var idx = this.heapArray.findIndex(function (el) { return fn(el, o); });
                    if (idx >= 0) {
                        if (idx === 0) {
                            this.pop();
                        }
                        else if (idx === this.length - 1) {
                            this.heapArray.pop();
                        }
                        else {
                            this.heapArray.splice(idx, 1, this.heapArray.pop());
                            this._sortNodeUp(idx);
                            this._sortNodeDown(idx);
                        }
                        return true;
                    }
                }
            }
            return false;
        };
        /**
         * Pop the current peek value, and add the new item.
         * @param  {any} element  Element to replace peek
         * @return {any}         Old peek
         */
        Heap.prototype.replace = function (element) {
            var peek = this.heapArray[0];
            this.heapArray[0] = element;
            this._sortNodeDown(0);
            return peek;
        };
        /**
         * Size of the heap
         * @return {Number}
         */
        Heap.prototype.size = function () {
            return this.length;
        };
        /**
         * Return the top (highest value) N elements of the heap.
         *
         * @param  {Number} n  Number of elements.
         * @return {Array}    Array of length <= N.
         */
        Heap.prototype.top = function (n) {
            if (n === void 0) { n = 1; }
            if (this.heapArray.length === 0 || n <= 0) {
                // Nothing to do
                return [];
            }
            else if (this.heapArray.length === 1 || n === 1) {
                // Just the peek
                return [this.heapArray[0]];
            }
            else if (n >= this.heapArray.length) {
                // The whole peek
                return __spread(this.heapArray);
            }
            else {
                // Some elements
                var result = this._topN_push(~~n);
                return result;
            }
        };
        /**
         * Clone the heap's internal array
         * @return {Array}
         */
        Heap.prototype.toArray = function () {
            return __spread(this.heapArray);
        };
        /**
         * String output, call to Array.prototype.toString()
         * @return {String}
         */
        Heap.prototype.toString = function () {
            return this.heapArray.toString();
        };
        /**
         * Get the element at the given index.
         * @param  {Number} i Index to get
         * @return {any}       Element at that index
         */
        Heap.prototype.get = function (i) {
            return this.heapArray[i];
        };
        /**
         * Get the elements of these node's children
         * @param  {Number} idx Node index
         * @return {Array(any)}  Children elements
         */
        Heap.prototype.getChildrenOf = function (idx) {
            var _this = this;
            return Heap.getChildrenIndexOf(idx)
                .map(function (i) { return _this.heapArray[i]; })
                .filter(function (e) { return e !== undefined; });
        };
        /**
         * Get the element of this node's parent
         * @param  {Number} idx Node index
         * @return {any}     Parent element
         */
        Heap.prototype.getParentOf = function (idx) {
            var pi = Heap.getParentIndexOf(idx);
            return this.heapArray[pi];
        };
        /**
         * Iterator interface
         */
        Heap.prototype[Symbol.iterator] = function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.length) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.pop()];
                    case 1:
                        _a.sent();
                        return [3 /*break*/, 0];
                    case 2: return [2 /*return*/];
                }
            });
        };
        /**
         * Returns an iterator. To comply with Java interface.
         */
        Heap.prototype.iterator = function () {
            return this;
        };
        /**
         * Limit heap size if needed
         */
        Heap.prototype._applyLimit = function () {
            if (this._limit && this._limit < this.heapArray.length) {
                var rm = this.heapArray.length - this._limit;
                // It's much faster than splice
                while (rm) {
                    this.heapArray.pop();
                    --rm;
                }
            }
        };
        /**
         * Return the bottom (lowest value) N elements of the heap, without corner cases, unsorted
         *
         * @param  {Number} n  Number of elements.
         * @return {Array}     Array of length <= N.
         */
        Heap.prototype._bottomN_push = function (n) {
            // Use an inverted heap
            var bottomHeap = new Heap(this.compare);
            bottomHeap.limit = n;
            bottomHeap.heapArray = this.heapArray.slice(-n);
            bottomHeap.init();
            var startAt = this.heapArray.length - 1 - n;
            var parentStartAt = Heap.getParentIndexOf(startAt);
            var indices = [];
            for (var i = startAt; i > parentStartAt; --i) {
                indices.push(i);
            }
            var arr = this.heapArray;
            while (indices.length) {
                var i = indices.shift();
                if (this.compare(arr[i], bottomHeap.peek()) > 0) {
                    bottomHeap.replace(arr[i]);
                    if (i % 2) {
                        indices.push(Heap.getParentIndexOf(i));
                    }
                }
            }
            return bottomHeap.toArray();
        };
        /**
         * Move a node to a new index, switching places
         * @param  {Number} j First node index
         * @param  {Number} k Another node index
         */
        Heap.prototype._moveNode = function (j, k) {
            var _a;
            _a = __read([this.heapArray[k], this.heapArray[j]], 2), this.heapArray[j] = _a[0], this.heapArray[k] = _a[1];
        };
        /**
         * Move a node down the tree (to the leaves) to find a place where the heap is sorted.
         * @param  {Number} i Index of the node
         */
        Heap.prototype._sortNodeDown = function (i) {
            var _this = this;
            var moveIt = i < this.heapArray.length - 1;
            var self = this.heapArray[i];
            var getPotentialParent = function (best, j) {
                if (_this.heapArray.length > j && _this.compare(_this.heapArray[j], _this.heapArray[best]) < 0) {
                    best = j;
                }
                return best;
            };
            while (moveIt) {
                var childrenIdx = Heap.getChildrenIndexOf(i);
                var bestChildIndex = childrenIdx.reduce(getPotentialParent, childrenIdx[0]);
                var bestChild = this.heapArray[bestChildIndex];
                if (typeof bestChild !== 'undefined' && this.compare(self, bestChild) > 0) {
                    this._moveNode(i, bestChildIndex);
                    i = bestChildIndex;
                }
                else {
                    moveIt = false;
                }
            }
        };
        /**
         * Move a node up the tree (to the root) to find a place where the heap is sorted.
         * @param  {Number} i Index of the node
         */
        Heap.prototype._sortNodeUp = function (i) {
            var moveIt = i > 0;
            while (moveIt) {
                var pi = Heap.getParentIndexOf(i);
                if (pi >= 0 && this.compare(this.heapArray[pi], this.heapArray[i]) > 0) {
                    this._moveNode(i, pi);
                    i = pi;
                }
                else {
                    moveIt = false;
                }
            }
        };
        /**
         * Return the top (highest value) N elements of the heap, without corner cases, unsorted
         * Implementation: push.
         *
         * @param  {Number} n  Number of elements.
         * @return {Array}     Array of length <= N.
         */
        Heap.prototype._topN_push = function (n) {
            // Use an inverted heap
            var topHeap = new Heap(this._invertedCompare);
            topHeap.limit = n;
            var indices = [0];
            var arr = this.heapArray;
            while (indices.length) {
                var i = indices.shift();
                if (i < arr.length) {
                    if (topHeap.length < n) {
                        topHeap.push(arr[i]);
                        indices.push.apply(indices, __spread(Heap.getChildrenIndexOf(i)));
                    }
                    else if (this.compare(arr[i], topHeap.peek()) < 0) {
                        topHeap.replace(arr[i]);
                        indices.push.apply(indices, __spread(Heap.getChildrenIndexOf(i)));
                    }
                }
            }
            return topHeap.toArray();
        };
        /**
         * Return the top (highest value) N elements of the heap, without corner cases, unsorted
         * Implementation: init + push.
         *
         * @param  {Number} n  Number of elements.
         * @return {Array}     Array of length <= N.
         */
        Heap.prototype._topN_fill = function (n) {
            // Use an inverted heap
            var heapArray = this.heapArray;
            var topHeap = new Heap(this._invertedCompare);
            topHeap.limit = n;
            topHeap.heapArray = heapArray.slice(0, n);
            topHeap.init();
            var branch = Heap.getParentIndexOf(n - 1) + 1;
            var indices = [];
            for (var i = branch; i < n; ++i) {
                indices.push.apply(indices, __spread(Heap.getChildrenIndexOf(i).filter(function (l) { return l < heapArray.length; })));
            }
            if ((n - 1) % 2) {
                indices.push(n);
            }
            while (indices.length) {
                var i = indices.shift();
                if (i < heapArray.length) {
                    if (this.compare(heapArray[i], topHeap.peek()) < 0) {
                        topHeap.replace(heapArray[i]);
                        indices.push.apply(indices, __spread(Heap.getChildrenIndexOf(i)));
                    }
                }
            }
            return topHeap.toArray();
        };
        /**
         * Return the top (highest value) N elements of the heap, without corner cases, unsorted
         * Implementation: heap.
         *
         * @param  {Number} n  Number of elements.
         * @return {Array}     Array of length <= N.
         */
        Heap.prototype._topN_heap = function (n) {
            var topHeap = this.clone();
            var result = [];
            for (var i = 0; i < n; ++i) {
                result.push(topHeap.pop());
            }
            return result;
        };
        /**
         * Return index of the top element
         * @param list
         */
        Heap.prototype._topIdxOf = function (list) {
            if (!list.length) {
                return -1;
            }
            var idx = 0;
            var top = list[idx];
            for (var i = 1; i < list.length; ++i) {
                var comp = this.compare(list[i], top);
                if (comp < 0) {
                    idx = i;
                    top = list[i];
                }
            }
            return idx;
        };
        /**
         * Return the top element
         * @param list
         */
        Heap.prototype._topOf = function () {
            var list = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                list[_i] = arguments[_i];
            }
            var heap = new Heap(this.compare);
            heap.init(list);
            return heap.peek();
        };
        return Heap;
    }());

    exports.Heap = Heap;
    exports.default = Heap;
    exports.toInt = toInt;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
