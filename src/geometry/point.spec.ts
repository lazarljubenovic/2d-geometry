import 'mocha'
import { assert } from 'chai'
import * as Point from './point'

describe(`Point`, () => {

  describe(`add`, () => {

    it(`returns same point when adding itself`, () => {
      const p = { x: 1, y: 2 }
      const result = Point.add(p)
      assert.deepEqual(result, { x: 1, y: 2 })
    })

    it(`returns correct result when adding two points`, () => {
      const p = { x: 1, y: 2 }
      const q = { x: 3, y: 4 }
      const result = Point.add(p, q)
      assert.deepEqual(result, { x: 4, y: 6 })
    })

    it(`returns correct result when adding multiple points`, () => {
      const points = [
        { x: 1, y: 2 },
        { x: 3, y: 4 },
        { x: 5, y: 6 },
        { x: 7, y: 8 },
      ]
      const result = Point.add(...points)
      assert.deepEqual(result, { x: 16, y: 20 })
    })

  })

})
