import Heap from "./Heap"

const someValues = [3, 15, 2, 300, 16, 4, 1, 8, 50, 21, 58, 7, 4, 9, 78, 88]
const otherValues = [12, 1, 2, 30, 116, 42, 12, 18, 1, 1, 1, 1]

describe("Heap class", function() {
  describe("#getParentIndexOf()", function() {
    it("should return parent for every children", function() {
      let p
      for (let i = 100; i > 0; --i) {
        p = (i - 2 + i % 2) / 2
        expect(Heap.getParentIndexOf(i)).toEqual(p)
      }
    })
    it("should return -1 for index <= 0", function() {
      expect(Heap.getParentIndexOf(0)).toEqual(-1)
      expect(Heap.getParentIndexOf(-100)).toEqual(-1)
    })
  })
  describe("#getChildrenIndexOf()", function() {
    it("should return children for every index", function() {
      let c
      for (let i = 100; i >= 0; --i) {
        c = [i * 2 + 1, i * 2 + 2]
        expect(Heap.getChildrenIndexOf(i)).toEqual(c)
      }
    })
  })
  describe("#getSiblingIndexOf()", function() {
    it("should return sibling index", function() {
      expect(Heap.getSiblingIndexOf(1)).toEqual(2)
      expect(Heap.getSiblingIndexOf(2)).toEqual(1)
      expect(Heap.getSiblingIndexOf(20)).toEqual(19)
      expect(Heap.getSiblingIndexOf(11)).toEqual(12)
    })
  })
  describe("#heapify", function() {
    it("should return a heap from an array", function() {
      const heapArr = someValues.slice(0)
      Heap.heapify(heapArr)
      expect(Array.isArray(heapArr)).toBe(true)
      expect(heapArr.length).toEqual(someValues.length)

      const checkHeap = new Heap<number>()
      checkHeap.heapArray = heapArr.slice(0)
      expect(checkHeap.check()).not.toBeDefined()
    })
  })
  describe("#heappush", function() {
    it("should push an element to the array as a heap", function() {
      const heapArr = someValues.slice(0)
      Heap.heapify(heapArr)
      Heap.heappush(heapArr, 30000)
      expect(Array.isArray(heapArr)).toBe(true)
      expect(heapArr.length).toEqual(someValues.length + 1)

      const checkHeap = new Heap<number>()
      checkHeap.heapArray = heapArr.slice(0)
      expect(checkHeap.check()).not.toBeDefined()
      expect(checkHeap.contains(30000)).toBe(true)
    })
  })
  describe("#heappop", function() {
    it("should pop the peek of the array as a heap", function() {
      const heapArr = someValues.slice(0)
      Heap.heapify(heapArr)
      const peek = Heap.heappop(heapArr) as number
      expect(Array.isArray(heapArr)).toBe(true)
      expect(heapArr.length).toEqual(someValues.length - 1)
      expect(Math.min(peek, ...heapArr)).toEqual(peek)

      const checkHeap = new Heap<number>()
      checkHeap.heapArray = heapArr.slice(0)
      expect(checkHeap.check()).not.toBeDefined()
    })
  })
  describe("#heappushpop", function() {
    it("should push and pop as a heap", function() {
      const heapArr = someValues.slice(0)
      Heap.heapify(heapArr)

      let peek = Heap.heappushpop(heapArr, -1)
      expect(Array.isArray(heapArr)).toBe(true)
      expect(heapArr.length).toEqual(someValues.length)
      expect(peek).toEqual(-1)

      peek = Heap.heappushpop(heapArr, 1)
      expect(heapArr.length).toEqual(someValues.length)
      expect(peek).toBeLessThanOrEqual(Math.min(...heapArr))

      peek = Heap.heappushpop(heapArr, 500)
      expect(heapArr.length).toEqual(someValues.length)
      expect(peek).toBeLessThan(500)

      const checkHeap = new Heap<number>()
      checkHeap.heapArray = heapArr.slice(0)
      expect(checkHeap.check()).not.toBeDefined()
    })
  })
  describe("#heapreplace", function() {
    it("should pop and push as a heap", function() {
      const heapArr = someValues.slice(0)
      Heap.heapify(heapArr)

      let _in = -1
      let peek = Heap.heapreplace(heapArr, _in)
      expect(Array.isArray(heapArr)).toBe(true)
      expect(heapArr.length).toBe(someValues.length)
      expect(peek).toBe(Math.min(...someValues))
      expect(heapArr[0]).toBe(_in)
      expect(heapArr[0]).toBeLessThanOrEqual(Math.min(...heapArr))

      _in = 1
      peek = Heap.heapreplace(heapArr, _in)
      expect(heapArr.length).toEqual(someValues.length)
      expect(peek).toBe(-1)
      expect(heapArr[0]).toBe(_in)
      expect(heapArr[0]).toBeLessThanOrEqual(Math.min(...heapArr))

      _in = 500
      peek = Heap.heapreplace(heapArr, _in)
      expect(heapArr.length).toEqual(someValues.length)
      expect(peek).toBeLessThan(_in)
      expect(heapArr[0]).not.toBe(_in)
      expect(heapArr[0]).toBeLessThanOrEqual(Math.min(...heapArr))

      const checkHeap = new Heap<number>()
      checkHeap.heapArray = heapArr.slice(0)
      expect(checkHeap.check()).not.toBeDefined()
    })
  })
  describe("#heaptop", function() {
    it("should return the most valuable elements", function() {
      const arr = [1, 12, 3, 41, 51, 16, 7]
      Heap.heapify(arr)
      expect(Heap.heaptop(arr, 1)).toEqual([Math.min(...arr)])
      expect(Heap.heaptop(arr, 3)).toEqual([1, 3, 7])
      expect(Heap.heaptop(arr, 4)).toEqual([1, 3, 7, 12])
      expect(Heap.heaptop(arr)).toEqual(Heap.heaptop(arr, 1))
    })
  })
  describe("#heapbottom", function() {
    it("should return the least valuable elements", function() {
      const arr = [1, 12, 3, 41, 51, 16, 7]
      Heap.heapify(arr)
      expect(Heap.heapbottom(arr, 1)).toEqual([Math.max(...arr)])
      expect(Heap.heapbottom(arr, 3)).toEqual([51, 41, 16])
      expect(Heap.heapbottom(arr, 4)).toEqual([51, 41, 16, 12])
      expect(Heap.heapbottom(arr)).toEqual(Heap.heapbottom(arr, 1))
    })
  })
})

describe("Heap instances", function() {
  const heaps = [
    {
      type: "min heap (default)",
      factory: () => new Heap<number>()
    },
    {
      type: "max heap",
      factory: () => new Heap<number>(Heap.maxComparator)
    }
  ]

  heaps.forEach(heapInstance => {
    const { type, factory } = heapInstance
    let heap: Heap<number>
    describe(type, function() {
      beforeEach(function() {
        heap = factory()
      })

      describe("#_moveNode(i, j)", function() {
        it("should switch elements", function() {
          heap.init(someValues)
          const iv = heap.get(2)
          const jv = heap.get(5)
          heap._moveNode(2, 5)
          expect(iv).not.toBe(jv)
          expect(heap.get(5)).toEqual(iv)
          expect(heap.get(2)).toEqual(jv)
        })
      })

      describe("#_sortNodeUp(i)", function() {
        it("should move the element up the hierarchy", function() {
          const arr = [3, 2, 1]
          arr.sort((a, b) => heap.comparator()(a, b) * -1)
          heap.heapArray = arr.slice(0)
          // move it
          heap._sortNodeUp(2)
          expect(heap.heapArray[0]).toEqual(arr[2])
          expect(heap.heapArray[2]).toEqual(arr[0])
          // do not move it
          heap._sortNodeUp(2)
          expect(arr.slice(0, 2)).not.toContain(heap.heapArray[0])
          expect(arr.slice(0, 2)).toContain(heap.heapArray[2])
        })
      })

      describe("#_sortNodeDown(i)", function() {
        it("should move the element down the hierarchy", function() {
          const arr = [3, 2, 1]
          // reverse order
          arr.sort((a, b) => heap.comparator()(a, b) * -1)
          heap.heapArray = arr.slice(0)
          // move it
          heap._sortNodeDown(0)
          expect(heap.heapArray[2]).toEqual(arr[0])
          expect(heap.heapArray[0]).toEqual(arr[2])
          // do not move it
          heap._sortNodeDown(0)
          expect(arr.slice(0, 2)).not.toContain(heap.heapArray[0])
          expect(arr.slice(0, 2)).toContain(heap.heapArray[2])
        })
      })

      describe("#bottom(N)", function() {
        it("should return an empty array for an empty heap", function() {
          expect(heap.bottom()).toEqual([])
          expect(heap.bottom(10)).toEqual([])
        })
        it("should return an empty array for invalid N", function() {
          heap.init(someValues)
          expect(heap.bottom(0)).toEqual([])
          expect(heap.bottom(-10)).toEqual([])
        })
        it("should return the peek for an one-element heap", function() {
          heap.push(1)
          expect(heap.bottom()).toEqual([1])
          expect(heap.bottom(10)).toEqual([1])
        })
        it("should return the lowest value N (<= length) elements of the heap", function() {
          heap.init(someValues.concat(someValues))
          const bottom = heap.toArray().slice(0)
          bottom.sort(heap._invertedCompare)
          expect(heap.bottom(1)).toEqual(bottom.slice(0, 1))
          expect(heap.bottom(6)).toEqual(bottom.slice(0, 6))
          expect(heap.bottom(someValues.length + 100)).toEqual(bottom)
        })
        it("should return the lowest element of the heap if no N", function() {
          heap.init(someValues.concat(someValues))
          expect(heap.bottom()).toEqual(heap.bottom(1))
        })
      })

      describe("#check()", function() {
        it("should check if the heap is sorted", function() {
          heap.init(someValues)
          expect(heap.check()).not.toBeDefined()
          // Change comparison function to fail check
          heap.compare = (a, b) => 1
          expect(heap.check()).toBeDefined()
        })
      })

      describe("#clear()", function() {
        it("should clear the heap", function() {
          heap.init(someValues)
          heap.clear()
          expect(heap.length).toEqual(0)
          expect(heap.toArray()).toEqual([])
        })
      })

      describe("#clone()", function() {
        it("should clone the heap to a new one", function() {
          heap.init(someValues)
          const cloned = heap.clone()
          expect(cloned.length).toEqual(heap.length)
          expect(heap.heapArray).not.toBe(cloned.heapArray)
          expect(cloned.heapArray).toEqual(heap.heapArray)
          expect(cloned.compare(2, 5)).toEqual(heap.compare(2, 5))
          expect(cloned.limit).toEqual(heap.limit)
        })
      })

      describe("#comparator()", function() {
        it("should return the comparison function", function() {
          const fn = heap.comparator()
          expect(typeof fn).toBe("function")
          expect(heap.compare).toEqual(fn)
        })
      })

      describe("#contains(element)", function() {
        it("should find an element in the heap", function() {
          heap.init(someValues)
          expect(heap.contains(someValues[5])).toBe(true)
        })
        it("should not find an element not in the heap", function() {
          heap.init(someValues)
          expect(heap.contains(5000)).toBe(false)
        })
      })

      describe("#contains(element, fn)", function() {
        it("should find an element in the heap", function() {
          heap.init(someValues)
          expect(heap.contains(someValues[5], (el, o) => el > o)).toBe(true)
        })
        it("should not find an element not in the heap", function() {
          heap.init(someValues)
          expect(heap.contains(1, (el, o) => el < o)).toBe(false)
        })
      })

      describe("#get(index)", function() {
        it("should return the element", function() {
          heap.init(someValues)
          expect(heap.get(0)).toEqual(heap.peek())
          expect(heap.get(5)).toEqual(heap.heapArray[5])
        })
      })

      describe("#init()", function() {
        it("should initialize a new heap", function() {
          heap.init(someValues)
          heap.init(otherValues)
          expect(heap.length).toEqual(otherValues.length)
        })
        it("should balance the heap", function() {
          heap.heapArray = someValues.slice(0)
          heap.init()
          expect(heap.length).toEqual(someValues.length)
          expect(heap.check()).not.toBeDefined()
        })
      })

      describe("#isEmpty()", function() {
        it("should return if heap is empty", function() {
          const filledHeap = factory()
          filledHeap.add(someValues[0])
          expect(heap.isEmpty()).toBe(true)
          expect(filledHeap.isEmpty()).toBe(false)
        })
      })

      describe("#leafs()", function() {
        it("should return an empty array for an empty heap", function() {
          expect(heap.leafs()).toEqual([])
        })
        it("should return the peek in a heap size one", function() {
          heap.init([1])
          expect(heap.leafs()).toEqual([1])
        })
        it("should return all the nodes without children", function() {
          heap.init(someValues)
          expect(heap.leafs()).toEqual(heap.toArray().slice(-8))
        })
      })

      describe("#lenght / size()", function() {
        it("should return the heap length", function() {
          expect(heap.length).toEqual(0)
          expect(heap.size()).toEqual(0)
          heap.init(someValues)
          expect(heap.length).toEqual(someValues.length)
          expect(heap.size()).toEqual(someValues.length)
        })
      })

      describe("#limit", function() {
        it("should limit the heap length", function() {
          heap.init(someValues)
          expect(heap.length).toEqual(someValues.length)
          heap.limit = 5
          expect(heap.limit).toEqual(5)
          expect(heap.length).toEqual(5)
          heap.push(...otherValues)
          expect(heap.length).toEqual(5)
          expect(heap.check()).not.toBeDefined()
        })
      })

      describe("#peek()", function() {
        it("should return the top element of the heap", function() {
          const min = Math.min(...someValues)
          const max = Math.max(...someValues)
          const peek = heap.compare(min, max) < 0 ? min : max
          heap.init(someValues)
          expect(heap.peek()).toEqual(peek)
        })
      })

      describe("#print()", function() {
        it("should output a pretty print", function() {
          heap.init(someValues)
          expect(Heap.print(heap)).toContain(someValues[3])
        })
      })

      describe("#push() / add, offer, addAll", function() {
        it("should add one element to the heap, sorted", function() {
          const len = heap.length
          someValues.forEach(el => heap.push(el))
          expect(heap.length).toEqual(len + someValues.length)
          expect(heap.check()).not.toBeDefined()
        })
        it("should add many elements to the heap, sorted", function() {
          heap.init(someValues)
          const len = heap.length
          heap.push(...otherValues)
          expect(heap.length).toEqual(len + otherValues.length)
          expect(heap.check()).not.toBeDefined()
        })
        it("should ignore empty calls", function() {
          heap.push(...someValues)
          const len = heap.length
          expect(heap.push()).toBe(false)
          expect(heap.length).toEqual(len)
        })
      })

      describe("#pop() / poll", function() {
        it("should extract the element at the top, and keep the heap sorted", function() {
          heap.init(someValues)
          const peek = heap.peek()
          const len = heap.length
          expect(heap.pop()).toEqual(peek)
          expect(heap.length).toEqual(len - 1)
          expect(heap.check()).not.toBeDefined()
        })
      })

      describe("#pushpop(element)", function() {
        it("should push a below-peek and pop the peek, and keep the heap sorted", function() {
          heap.init(someValues)
          const peek = heap.peek() as number
          const len = heap.length
          const next = -1 * heap.compare(peek, 5000)
          expect(heap.pushpop(next)).toEqual(peek)
          expect(heap.length).toEqual(len)
          expect(heap.check()).not.toBeDefined()
        })
        it("should push an above-peek and pop the peek, and keep the heap sorted", function() {
          heap.init(someValues)
          const peek = heap.peek() as number
          const len = heap.length
          const next = heap.compare(peek, 5000)
          expect(heap.pushpop(next)).toEqual(next)
          expect(heap.length).toEqual(len)
          expect(heap.check()).not.toBeDefined()
        })
      })

      describe("#remove()", function() {
        it("should skip an empty heap", function() {
          expect(heap.remove()).toBe(false)
        })
        it("should skip if no element matches", function() {
          heap.init(someValues)
          const len = heap.length
          expect(heap.remove(50000)).toBe(false)
          expect(heap.length).toBe(len)
        })
        it("should remove the peek if it matches and length is 1", function() {
          heap.init([999])
          expect(heap.remove(999)).toBe(true)
          expect(heap.length).toBe(0)
        })
        it("should remove the leaf if it matches the end", function() {
          heap.init(someValues)
          const len = heap.length
          const bottom = heap.heapArray[heap.length - 1]
          expect(heap.remove(bottom)).toBe(true)
          expect(heap.heapArray[heap.length - 1]).not.toBe(bottom)
          expect(heap.length).toBe(len - 1)
          expect(heap.check()).not.toBeDefined()
        })
        it("should remove the element from the heap, and keep the heap sorted", function() {
          heap.init(someValues)
          const len = heap.length
          expect(heap.remove(someValues[3])).toBe(true)
          expect(heap.remove(someValues[4])).toBe(true)
          expect(heap.length).toBe(len - 2)
          expect(heap.check()).not.toBeDefined()
        })
        it("whithout element, should remove the peek", function() {
          heap.init(someValues)
          const peek = heap.peek()
          const len = heap.length
          expect(heap.remove()).toBe(true)
          expect(heap.peek()).not.toBe(peek)
          expect(heap.length).toBe(len - 1)
          expect(heap.check()).not.toBeDefined()
        })
        it("with comparison function, should remove custom match element", function() {
          heap.init(someValues)
          const peek = heap.peek()
          const len = heap.length
          // Custom function that matches latest value, ignoring 999
          expect(
            heap.remove(
              999,
              (el, o) => el === someValues[someValues.length - 1]
            )
          ).toBe(true)
          expect(heap.length).toBe(len - 1)
          expect(heap.check()).not.toBeDefined()
        })
      })

      describe("#replace(element)", function() {
        it("should put the element at the top, and then sort it", function() {
          heap.init(someValues)
          const len = heap.length
          const peek = heap.peek()
          expect(heap.replace(3000)).toEqual(peek)
          expect(heap.length).toEqual(len)
          expect(heap.contains(3000)).toBe(true)
          expect(heap.check()).not.toBeDefined()
        })
      })

      describe("#top(N)", function() {
        it("should return an empty array for an empty heap", function() {
          expect(heap.top()).toEqual([])
          expect(heap.top(10)).toEqual([])
        })
        it("should return an empty array for invalid N", function() {
          heap.init(someValues)
          expect(heap.top(0)).toEqual([])
          expect(heap.top(-10)).toEqual([])
        })
        it("should return the top N (<= length) elements of the heap", function() {
          heap.init(someValues.concat(someValues))
          const top = heap.toArray().slice(0)
          top.sort(heap.comparator())
          expect(heap.top(1)).toEqual(top.slice(0, 1))
          expect(heap.top(6)).toEqual(top.slice(0, 6))
          expect(heap.top(someValues.length + 100)).toEqual(top)
        })
        it("should return the top element of the heap if no N", function() {
          heap.init(someValues.concat(someValues))
          expect(heap.top()).toEqual(heap.top(1))
        })
      })

      describe("#toArray()", function() {
        it("should return an array", function() {
          heap.init(someValues)
          const arr = heap.toArray()
          expect(Array.isArray(arr)).toBe(true)
          expect(arr.length).toEqual(someValues.length)
          const clonedValues = someValues.slice(0)
          clonedValues.sort(heap.comparator())
          arr.sort(heap.comparator())
          expect(arr).toEqual(clonedValues)
        })
      })

      describe("#toString()", function() {
        it("should return an string", function() {
          heap.init(someValues)
          expect(heap.toString().length).toEqual(someValues.toString().length)
        })
      })
    })
  })
})
