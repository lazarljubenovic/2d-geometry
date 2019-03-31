import 'mocha'
import { assert } from 'chai'
import * as Point from './point'
import { analyze, Flags, printFlags, Result, IntersectionType } from './vector-intersection'

function Pts (s1p1x: number, s1p1y: number, s1p2x: number, s1p2y: number,
              s2p1x: number, s2p1y: number, s2p2x: number, s2p2y: number) {
  const s1p1 = Point.New(s1p1x, s1p1y)
  const s1p2 = Point.New(s1p2x, s1p2y)
  const s2p1 = Point.New(s2p1x, s2p1y)
  const s2p2 = Point.New(s2p2x, s2p2y)
  return [s1p1, s1p2, s2p1, s2p2] as [Point.T, Point.T, Point.T, Point.T]
}

describe(`two segments`, () => {

  describe(`both points are degenerate`, () => {

    it(`points coincide => that's the intersection`, () => {
      const pts = Pts(3, 3, 3, 3, 3, 3, 3, 3)
      const actual = analyze(...pts)
      const expected: Result = {
        type: IntersectionType.Point,
        point: Point.New(3, 3),
        flags: Flags.U1 | Flags.U2 | Flags.V1 | Flags.V2 | Flags.DegenerateU | Flags.DegenerateV | Flags.Collinear,
      }
      assert.deepEqual(actual, expected)
    })

    it(`points are distinct => no intersection`, () => {
      const pts = Pts(1, 1, 1, 1, 3, 3, 3, 3)
      const actual = analyze(...pts)
      const expected: Result = {
        type: IntersectionType.None,
        flags: Flags.DegenerateU | Flags.DegenerateV | Flags.Collinear,
      }
      assert.deepEqual(actual, expected)
    })

  })

  describe(`only S1 is degenerate`, () => {

    it(`s1 is on start point of s2`, () => {
      const pts = Pts(1, 2, 1, 2, 1, 2, 3, 4)
      const actual = analyze(...pts)
      const expected: Result = {
        type: IntersectionType.Point,
        point: Point.New(1, 2),
        flags: Flags.DegenerateU | Flags.Collinear | Flags.U1 | Flags.U2 | Flags.V1,
      }
      assert.deepEqual(actual, expected)
    })

    it(`s1 is on end point of s2`, () => {
      const pts = Pts(3, 4, 3, 4, 1, 2, 3, 4)
      const actual = analyze(...pts)
      const expected: Result = {
        type: IntersectionType.Point,
        point: Point.New(3, 4),
        flags: Flags.DegenerateU | Flags.Collinear | Flags.U1 | Flags.U2 | Flags.V2,
      }
      assert.deepEqual(actual, expected)
    })

    it(`s1 is on s2`, () => {
      const pts = Pts(3, 2, 3, 2, 1, 1, 5, 3)
      const actual = analyze(...pts)
      const expected: Result = {
        type: IntersectionType.Point,
        point: Point.New(3, 2),
        flags: Flags.DegenerateU | Flags.Collinear | Flags.U1 | Flags.U2,
      }
      assert.deepEqual(actual, expected)
    })

    it(`s1 is outside`, () => {
      const pts = Pts(4, 4, 4, 4, 1, 1, 2, 2)
      const actual = analyze(...pts)
      const expected: Result = {
        type: IntersectionType.None,
        flags: Flags.DegenerateU,
      }
      assert.deepEqual(actual, expected)
    })

  })

  describe(`only S2 is degenerate`, () => {

    it(`s2 is on start point of s1`, () => {
      const pts = Pts(1, 2, 3, 4, 1, 2, 1, 2)
      const actual = analyze(...pts)
      const expected: Result = {
        type: IntersectionType.Point,
        point: Point.New(1, 2),
        flags: Flags.DegenerateV | Flags.Collinear | Flags.V1 | Flags.V2 | Flags.U1,
      }
      assert.deepEqual(actual, expected)
    })

    it(`s2 is on end point of s1`, () => {
      const pts = Pts(1, 2, 3, 4, 3, 4, 3, 4)
      const actual = analyze(...pts)
      const expected: Result = {
        type: IntersectionType.Point,
        point: Point.New(3, 4),
        flags: Flags.DegenerateV | Flags.Collinear | Flags.V1 | Flags.V2 | Flags.U2,
      }
      assert.deepEqual(actual, expected)
    })

    it(`s2 is on s1`, () => {
      const pts = Pts(1, 1, 5, 3, 3, 2, 3, 2)
      const actual = analyze(...pts)
      const expected: Result = {
        type: IntersectionType.Point,
        point: Point.New(3, 2),
        flags: Flags.DegenerateV | Flags.Collinear | Flags.V1 | Flags.V2,
      }
      assert.deepEqual(actual, expected)
    })

    it(`s2 is outside`, () => {
      const pts = Pts(1, 1, 2, 2, 4, 4, 4, 4)
      const actual = analyze(...pts)
      const expected: Result = {
        type: IntersectionType.None,
        flags: Flags.DegenerateV,
      }
      assert.deepEqual(actual, expected)
    })

  })

  describe(`none are degenerate`, () => {

    describe(`collinear`, () => {

      describe(`no intersection`, () => {

        it(`same direction`, () => {
          const pts = Pts(1, 1, 1, 2, 1, 4, 1, 5)
          const actual = analyze(...pts)
          const expected: Result = {
            type: IntersectionType.None,
            flags: Flags.Collinear | Flags.Parallel,
          }
          assert.deepEqual(actual, expected)
        })

        it(`opposite direction`, () => {
          const pts = Pts(1, 2, 2, 2, 5, 2, 4, 2)
          const actual = analyze(...pts)
          const expected: Result = {
            type: IntersectionType.None,
            flags: Flags.Collinear | Flags.Parallel,
          }
          assert.deepEqual(actual, expected)
        })

      })

      describe(`touching at a point`, () => {

        describe(`u is left of v`, () => {

          it(`same direction`, () => {
            const pts = Pts(3, 2, 5, 2, 1, 2, 3, 2)
            const actual = analyze(...pts)
            const expected: Result = {
              type: IntersectionType.Point,
              point: Point.New(3, 2),
              flags: Flags.Collinear | Flags.Parallel | Flags.U1 | Flags.V2,
            }
            assert.deepEqual(actual, expected)
          })

          it(`opposite direction`, () => {
            const pts = Pts(5, 2, 3, 2, 1, 2, 3, 2)
            const actual = analyze(...pts)
            const expected: Result = {
              type: IntersectionType.Point,
              point: Point.New(3, 2),
              flags: Flags.Collinear | Flags.Parallel | Flags.U2 | Flags.V2,
            }
            assert.deepEqual(actual, expected)
          })

        })

        describe(`v is left of u`, () => {

          it(`same direction`, () => {
            const pts = Pts(1, 2, 3, 2, 3, 2, 5, 2)
            const actual = analyze(...pts)
            const expected: Result = {
              type: IntersectionType.Point,
              point: Point.New(3, 2),
              flags: Flags.Collinear | Flags.Parallel | Flags.U2 | Flags.V1,
            }
            assert.deepEqual(actual, expected)
          })

          it(`opposite direction`, () => {
            const pts = Pts(1, 2, 3, 2, 5, 2, 3, 2)
            const actual = analyze(...pts)
            const expected: Result = {
              type: IntersectionType.Point,
              point: Point.New(3, 2),
              flags: Flags.Collinear | Flags.Parallel | Flags.U2 | Flags.V2,
            }
            assert.deepEqual(actual, expected)
          })

        })

      })

      describe(`partial segment intersection`, () => {

        describe(`u is left of v`, () => {

          it(`same direction`, () => {
            const pts = Pts(1, 2, 4, 2, 2, 2, 5, 2)
            const actual = analyze(...pts)
            const expected: Result = {
              type: IntersectionType.Segment,
              point1: Point.New(2, 2),
              point2: Point.New(4, 2),
              flags: Flags.Collinear | Flags.Parallel | Flags.U2 | Flags.V1,
            }
            assert.deepEqual(actual, expected)
          })

          it(`opposite direction`, () => {
            const pts = Pts(1, 2, 4, 2, 5, 2, 2, 2)
            const actual = analyze(...pts)
            const expected: Result = {
              type: IntersectionType.Segment,
              point1: Point.New(4, 2),
              point2: Point.New(2, 2),
              flags: Flags.Collinear | Flags.Parallel | Flags.U2 | Flags.V2,
            }
            assert.deepEqual(actual, expected, `A: ${printFlags(actual.flags)}, E: ${printFlags(expected.flags)}`)
          })

        })

        describe(`v is left of u`, () => {

          it(`same direction`, () => {
            const pts = Pts(2, 1, 4, 1, 1, 1, 3, 1)
            const actual = analyze(...pts)
            const expected: Result = {
              type: IntersectionType.Segment,
              point1: Point.New(2, 1),
              point2: Point.New(3, 1),
              flags: Flags.Collinear | Flags.Parallel | Flags.U1 | Flags.V2,
            }
            assert.deepEqual(actual, expected)
          })

          it(`opposite direction`, () => {
            const pts = Pts(2, 1, 4, 1, 3, 1, 1, 1)
            const actual = analyze(...pts)
            const expected: Result = {
              type: IntersectionType.Segment,
              point1: Point.New(3, 1),
              point2: Point.New(2, 1),
              flags: Flags.Collinear | Flags.Parallel | Flags.U1 | Flags.V1,
            }
            assert.deepEqual(actual, expected)
          })

        })

      })

      describe(`one vector inside other`, () => {

        describe(`u inside v`, () => {

          it(`same direction`, () => {
            const pts = Pts(2, 5, 3, 5, 1, 5, 5, 5)
            const actual = analyze(...pts)
            const expected: Result = {
              type: IntersectionType.Segment,
              point1: Point.New(2, 5),
              point2: Point.New(3, 5),
              flags: Flags.Collinear | Flags.Parallel | Flags.U1 | Flags.U2,
            }
            assert.deepEqual(actual, expected)
          })

          it(`opposite direction`, () => {
            const pts = Pts(3, 5, 2, 5, 1, 5, 5, 5)
            const actual = analyze(...pts)
            const expected: Result = {
              type: IntersectionType.Segment,
              point1: Point.New(2, 5),
              point2: Point.New(3, 5),
              flags: Flags.Collinear | Flags.Parallel | Flags.U1 | Flags.U2,
            }
            assert.deepEqual(actual, expected)
          })

        })

        describe(`v inside u`, () => {

          it(`same direction`, () => {
            const pts = Pts(1, 1, 5, 5, 3, 3, 4, 4)
            const actual = analyze(...pts)
            const expected: Result = {
              type: IntersectionType.Segment,
              point1: Point.New(3, 3),
              point2: Point.New(4, 4),
              flags: Flags.Collinear | Flags.Parallel | Flags.V1 | Flags.V2,
            }
            assert.deepEqual(actual, expected)
          })

          it(`opposite direction`, () => {
            const pts = Pts(5, 5, 1, 1, 3, 3, 4, 4)
            const actual = analyze(...pts)
            const expected: Result = {
              type: IntersectionType.Segment,
              point1: Point.New(3, 3),
              point2: Point.New(4, 4),
              flags: Flags.Collinear | Flags.Parallel | Flags.V1 | Flags.V2,
            }
            assert.deepEqual(actual, expected)
          })

        })

      })

      describe(`complete overlap`, () => {

        it(`same direction`, () => {
          const pts = Pts(1, 2, 4, 3, 1, 2, 4, 3)
          const actual = analyze(...pts)
          const expected: Result = {
            type: IntersectionType.Segment,
            point1: Point.New(1, 2),
            point2: Point.New(4, 3),
            flags: Flags.Collinear | Flags.Parallel | Flags.U1 | Flags.U2 | Flags.V1 | Flags.V2,
          }
          assert.deepEqual(actual, expected)
        })

        it(`opposite direction`, () => {
          const pts = Pts(1, 2, 4, 3, 4, 3, 1, 2)
          const actual = analyze(...pts)
          const expected: Result = {
            type: IntersectionType.Segment,
            point1: Point.New(4, 3),
            point2: Point.New(1, 2),
            flags: Flags.Collinear | Flags.Parallel | Flags.U1 | Flags.U2 | Flags.V1 | Flags.V2,
          }
          assert.deepEqual(actual, expected)
        })

      })

    })

    describe(`parallel but not collinear`, () => {

      it(`no intersection`, () => {
        const pts = Pts(1, 1, 5, 3, 2, 3, 4, 4)
        const actual = analyze(...pts)
        const expected: Result = {
          type: IntersectionType.None,
          flags: Flags.Parallel,
        }
        assert.deepEqual(actual, expected)
      })

    })

    // @todo
    describe(`skewed`, () => {

      it(`one segment too short`)

      it(`both segments too short`)

      it(`u1 touches v1`)

      it(`u2 touches v1`)

      it(`u1 touches v2`)

      it(`u2 touched v2`)

      it(`u1 touches v`)

      it(`u2 touches v`)

      it(`v touches u1`)

      it(`v touches u2`)

      it(`regular intersection`)

    })

  })

})
