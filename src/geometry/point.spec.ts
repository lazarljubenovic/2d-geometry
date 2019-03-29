import 'mocha'
import { assert } from 'chai'
import * as Point from './point'
import * as Angle from './angle'

function assertPoints (u: Point.T, v: Point.T) {
  assert(Point.eq(u, v), `${Point.toString(u)} != ${Point.toString(v)}`)
}

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

  describe(`setLength`, () => {

    it(`sets length`, () => {
      const point = Point.New(4, 0)
      const desiredLength = 10
      const actual = Point.setLength(point, desiredLength)
      const expected = Point.New(10, 0)
      assertPoints(actual, expected)
    })

  })

  describe(`rotate`, () => {

    it(`rotates a point`, () => {
      const point = Point.New(3, 4)
      const actual = Point.rotate(point, Angle.toRad(30))
      const expected = Point.New(4.5980762113533, 1.9641016151378)
      assertPoints(actual, expected)
    })

  })

  describe(`rotateWrt`, () => {

    it(`rotates a point with respect to a pivot point`, () => {
      const point = Point.New(4, 9)
      const pivot = Point.New(1, 5)
      const actual = Point.rotateWrt(point, Angle.toRad(30), pivot)
      const expected = Point.New(5.5980762113533, 6.9641016151378)
      assertPoints(actual, expected)
    })

  })

})
