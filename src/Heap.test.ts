import Heap from "./Heap"

const someValues = [3, 15, 2, 300, 16, 4, 1, 8, 50, 21, 58, 7, 4, 9, 78, 88]
const otherValues = [12, 1, 2, 30, 116, 42, 12, 18, 1, 1, 1, 1]

describe("Heap class", function() {
  describe("#getParentIndexOf()", function() {
    it("should return parent for every children", function() {
      let p
      for (let i = 100; i > 0; --i) {
        p = (i - 2 + i % 2) / 2
        expect(p).toEqual(Heap.getParentIndexOf(i))
      }
    })
    it("should return -1 for index <= 0", function() {
      expect(-1).toBe(Heap.getParentIndexOf(0))
      expect(-1).toBe(Heap.getParentIndexOf(-100))
    })
  })
  describe("#getChildrenIndexOf()", function() {
    it("should return children for every index", function() {
      let c
      for (let i = 100; i >= 0; --i) {
        c = [i * 2 + 1, i * 2 + 2]
        expect(c).toEqual(Heap.getChildrenIndexOf(i))
      }
    })
  })
  describe("#heapify", function() {
    it("should return a heap from an array", function() {
      const heapArr = someValues.slice(0)
      Heap.heapify(heapArr)
      expect(Array.isArray(heapArr)).toBe(true)
      expect(someValues.length).toEqual(heapArr.length)

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
      expect(someValues.length + 1).toEqual(heapArr.length)

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
      expect(someValues.length - 1).toEqual(heapArr.length)
      expect(peek).toEqual(Math.min(peek, ...heapArr))

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
      expect(someValues.length).toEqual(heapArr.length)
      expect(peek).toEqual(-1)
      expect(peek).toBeLessThanOrEqual(Math.min(...heapArr))

      peek = Heap.heappushpop(heapArr, 500)
      expect(someValues.length).toEqual(heapArr.length)
      expect(peek).toBeLessThan(500)

      const checkHeap = new Heap<number>()
      checkHeap.heapArray = heapArr.slice(0)
      expect(checkHeap.check()).not.toBeDefined()
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
          expect(iv).toBe(heap.get(5))
          expect(jv).toBe(heap.get(2))
        })
      })

      describe("#_sortNodeUp(i)", function() {
        it("should move the element up the hierarchy", function() {
          const arr = [3, 2, 1]
          arr.sort((a, b) => heap.comparator()(a, b) * -1)
          heap.heapArray = arr.slice(0)
          // move it
          heap._sortNodeUp(2)
          expect(arr[2]).toBe(heap.heapArray[0])
          expect(arr[0]).toBe(heap.heapArray[2])
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
          expect(arr[0]).toBe(heap.heapArray[2])
          expect(arr[2]).toBe(heap.heapArray[0])
          // do not move it
          heap._sortNodeDown(0)
          expect(arr.slice(0, 2)).not.toContain(heap.heapArray[0])
          expect(arr.slice(0, 2)).toContain(heap.heapArray[2])
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
          expect(0).toBe(heap.length)
          expect([]).toEqual(heap.toArray())
        })
      })

      describe("#clone()", function() {
        it("should clone the heap to a new one", function() {
          heap.init(someValues)
          const cloned = heap.clone()
          expect(heap.length).toEqual(cloned.length)
          expect(heap.heapArray).not.toBe(cloned.heapArray)
          expect(heap.heapArray).toEqual(cloned.heapArray)
          expect(heap.compare(2, 5)).toEqual(cloned.compare(2, 5))
          expect(heap.limit).toEqual(cloned.limit)
        })
      })

      describe("#comparator()", function() {
        it("should return the comparison function", function() {
          const fn = heap.comparator()
          expect(typeof fn).toBe("function")
          expect(fn).toEqual(heap.compare)
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
          expect(heap.peek()).toBe(heap.get(0))
          expect(heap.heapArray[5]).toBe(heap.get(5))
        })
      })

      describe("#init()", function() {
        it("should initialize a new heap", function() {
          heap.init(someValues)
          heap.init(otherValues)
          expect(otherValues.length).toBe(heap.length)
        })
        it("should balance the heap", function() {
          heap.heapArray = someValues.slice(0)
          heap.init()
          expect(someValues.length).toBe(heap.length)
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

      describe("#lenght / size()", function() {
        it("should return the heap length", function() {
          expect(0).toBe(heap.length)
          expect(0).toBe(heap.size())
          heap.init(someValues)
          expect(someValues.length).toBe(heap.length)
          expect(someValues.length).toBe(heap.size())
        })
      })

      describe("#limit", function() {
        it("should limit the heap length", function() {
          heap.init(someValues)
          expect(someValues.length).toBe(heap.length)
          heap.limit = 5
          expect(5).toBe(heap.limit)
          expect(5).toBe(heap.length)
          heap.push(...otherValues)
          expect(5).toBe(heap.length)
          expect(heap.check()).not.toBeDefined()
        })
      })

      describe("#peek()", function() {
        it("should return the top element of the heap", function() {
          const min = Math.min(...someValues)
          const max = Math.max(...someValues)
          const peek = heap.compare(min, max) < 0 ? min : max
          heap.init(someValues)
          expect(peek).toBe(heap.peek())
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
          expect(len + someValues.length).toEqual(heap.length)
          expect(heap.check()).not.toBeDefined()
        })
        it("should add many elements to the heap, sorted", function() {
          heap.init(someValues)
          const len = heap.length
          heap.push(...otherValues)
          expect(len + otherValues.length).toEqual(heap.length)
          expect(heap.check()).not.toBeDefined()
        })
        it("should ignore empty calls", function() {
          heap.push(...someValues)
          const len = heap.length
          expect(heap.push()).toBe(false)
          expect(len).toEqual(heap.length)
        })
      })

      describe("#pop() / poll", function() {
        it("should extract the element at the top, and keep the heap sorted", function() {
          heap.init(someValues)
          const peek = heap.peek()
          const len = heap.length
          expect(peek).toEqual(heap.pop())
          expect(len - 1).toEqual(heap.length)
          expect(heap.check()).not.toBeDefined()
        })
      })

      describe("#pushpop(element)", function() {
        it("should push and pop, and keep the heap sorted", function() {
          heap.init(someValues)
          const peek = heap.peek()
          const len = heap.length
          // big value
          expect(peek).toEqual(heap.pushpop(5000))
          expect(len).toEqual(heap.length)
          expect(heap.check()).not.toBeDefined()
          // peek value
          expect(1).toEqual(heap.pushpop(1))
          expect(len).toEqual(heap.length)
          expect(heap.check()).not.toBeDefined()
        })
      })

      describe("#remove()", function() {
        it("should remove the element from the heap, and keep the heap sorted", function() {
          heap.init(someValues)
          const len = heap.length
          expect(heap.remove(50000)).toBe(false)
          expect(heap.remove(someValues[3])).toBe(true)
          expect(heap.remove(someValues[4])).toBe(true)
          expect(len - 2).toBe(heap.length)
          expect(heap.check()).not.toBeDefined()
        })
        it("whithout element should act like a pop", function() {
          heap.init(someValues)
          const peek = heap.peek()
          const len = heap.length
          expect(peek).toEqual(heap.pop())
          expect(len - 1).toEqual(heap.length)
          expect(heap.check()).not.toBeDefined()
        })
      })

      describe("#replace(element)", function() {
        it("should put the element at the top, and then sort it", function() {
          heap.init(someValues)
          const len = heap.length
          const peek = heap.peek()
          expect(peek).toEqual(heap.replace(3000))
          expect(len).toBe(heap.length)
          expect(heap.contains(3000)).toBe(true)
          expect(heap.check()).not.toBeDefined()
        })
      })

      describe("#top(N)", function() {
        it("should return the top N elements of the heap", function() {
          heap.init(someValues.concat(someValues))
          const top = heap.toArray().slice(0)
          top.sort(heap.comparator())
          expect([]).toEqual(heap.top(0))
          expect([]).toEqual(heap.top(-10))
          expect(top.slice(0, 1)).toEqual(heap.top())
          expect(top.slice(0, 1)).toEqual(heap.top(1))
          expect(top.slice(0, 3)).toEqual(heap.top(3))
          expect(top).toEqual(heap.top(someValues.length + 100))
        })
      })

      describe("#toArray()", function() {
        it("should return an array", function() {
          heap.init(someValues)
          const arr = heap.toArray()
          expect(Array.isArray(arr)).toBe(true)
          expect(someValues.length).toBe(arr.length)
          const clonedValues = someValues.slice(0)
          clonedValues.sort(heap.comparator())
          arr.sort(heap.comparator())
          expect(clonedValues).toEqual(arr)
        })
      })

      describe("#toString()", function() {
        it("should return an string", function() {
          heap.init(someValues)
          const str = heap.toString()
          expect(someValues.toString().length).toBe(str.length)
        })
      })

      describe("#nlargest(N)", function() {
        it("should return the largest (top) N elements of the heap")
      })

      describe("#nsmallest(N)", function() {
        it("should return the smallest (bottom) N elements of the heap")
      })
    })
  })
})
