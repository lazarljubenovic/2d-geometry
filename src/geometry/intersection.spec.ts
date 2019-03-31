import 'mocha'
import * as chai from 'chai'
import {raySegmentInclusive} from './intersection'
import * as Point from './point'

describe(`raySegmentInclusive`, () => {

  it(`sees intersection at first endpoint`, () => {
    const u1 = Point.New(2, 1)
    const u = Point.New(0, 1)
    const v1 = Point.New(2, 3)
    const v2 = Point.New(4, 4)
    const expected = Point.New(2, 3)
    const actual = raySegmentInclusive(u1, u, v1, v2)
    chai.assert.deepEqual(expected, actual)
  })

})
