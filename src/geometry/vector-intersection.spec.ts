import 'mocha'
import { assert } from 'chai'
import * as Point from './point'
import * as VectorIntersection from './vector-intersection'
import { VerbosityLevel } from 'rollup-plugin-typescript2/dist/context'

describe(`find`, () => {

  it(`finds regular intersection`, () => {
    const s1p1 = Point.New(1, 4)
    const s1p2 = Point.New(4, 1)
    const s2p1 = Point.New(2, 1)
    const s2p2 = Point.New(4, 3)
    const actual = VectorIntersection.find(s1p1, s1p2, s2p1, s2p2).point!
    const expected = Point.New(3, 2)
    assert(Point.eq(actual, expected))
  })

  it(`finds dot-to-line intersection`, () => {
    const s1p1 = Point.New(1, 4)
    const s1p2 = Point.New(4, 1)
    const s2p1 = Point.New(2.5, 2.5)
    const s2p2 = Point.New(4, 4)
    const actual = VectorIntersection.find(s1p1, s1p2, s2p1, s2p2).point!
    const expected = Point.New(2.5, 2.5)
    assert(Point.eq(actual, expected))
  })

  it(`finds dot-to-dot intersection at angle`, () => {
    const s1p1 = Point.New(1, 4)
    const s1p2 = Point.New(4, 1)
    const s2p1 = Point.New(4, 1)
    const s2p2 = Point.New(4, 4)
    const actual = VectorIntersection.find(s1p1, s1p2, s2p1, s2p2).point!
    const expected = Point.New(4, 1)
    assert(Point.eq(actual, expected))
  })

  it(`reports no intersection when one segment is too short`, () => {
    const s1p1 = Point.New(1, 2)
    const s1p2 = Point.New(4, 1)
    const s2p1 = Point.New(3, 4)
    const s2p2 = Point.New(3, 2)
    const actual = VectorIntersection.find(s1p1, s1p2, s2p1, s2p2).point
    assert.isNull(actual)
  })

  it(`reports no intersection when both segments are too short`, () => {
    const s1p1 = Point.New(1, 4)
    const s1p2 = Point.New(4, 3)
    const s2p1 = Point.New(2, 1)
    const s2p2 = Point.New(4, 2)
    const actual = VectorIntersection.find(s1p1, s1p2, s2p1, s2p2).point
    assert.isNull(actual)
  })

  it(`reports no intersection when lines are parallel but not collinear`, () => {
    const s1p1 = Point.New(1, 3)
    const s1p2 = Point.New(4, 4)
    const s2p1 = Point.New(1, 1)
    const s2p2 = Point.New(4, 2)
    const actual = VectorIntersection.find(s1p1, s1p2, s2p1, s2p2).point
    assert.isNull(actual)
  })

  it(`reports no intersection when collinear distinct`, () => {
    const s1p1 = Point.New(1, 1)
    const s1p2 = Point.New(2, 2)
    const s2p1 = Point.New(3, 3)
    const s2p2 = Point.New(4, 4)
    const actual = VectorIntersection.find(s1p1, s1p2, s2p1, s2p2).point
    assert.isNull(actual)
  })

  it(`reports overlap when partial overlap`, () => {
    const s1p1 = Point.New(1, 1)
    const s1p2 = Point.New(3, 3)
    const s2p1 = Point.New(2, 2)
    const s2p2 = Point.New(4, 4)
    const actual = VectorIntersection.find(s1p1, s1p2, s2p1, s2p2).type
    assert.equal(actual, VectorIntersection.Existence.OVERLAP)
  })

  it(`reports overlap when full overlap`, () => {
    const s1p1 = Point.New(1, 1)
    const s1p2 = Point.New(4, 4)
    const s2p1 = Point.New(1, 1)
    const s2p2 = Point.New(4, 4)
    const actual = VectorIntersection.find(s1p1, s1p2, s2p1, s2p2).type
    assert.equal(actual, VectorIntersection.Existence.OVERLAP)
  })

})
