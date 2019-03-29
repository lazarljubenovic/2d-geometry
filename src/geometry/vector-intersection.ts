import * as Point from './point'
import * as Line from './line'
import * as fpop from 'fpop'

export const enum Existence {
  NO,
  YES,
  OVERLAP,
}

export function exists (
  v11: Point.T,
  v12: Point.T,
  v21: Point.T,
  v22: Point.T,
): Existence {
  const line1 = Line.getGeneralFormFromSegment(v11, v12)
  const n1 = Line.equation(v21, line1)
  const n2 = Line.equation(v22, line1)
  if (fpop.arePositive(n1, n2) || fpop.areNegative(n1, n2)) return Existence.NO

  const line2 = Line.getGeneralFormFromSegment(v21, v22)
  const m1 = Line.equation(v11, line2)
  const m2 = Line.equation(v12, line2)
  if (fpop.arePositive(m1, m2) || fpop.areNegative(m1, m2)) return Existence.NO

  if (fpop.eq(line1.a * line2.b, line2.a * line1.b)) return Existence.OVERLAP

  return Existence.YES
}


type Result = {
  type: Existence.NO | Existence.OVERLAP
  point: null
} | {
  type: Existence.YES
  point: Point.T
}

export function find (
  s1p1: Point.T,
  s1p2: Point.T,
  s2p1: Point.T,
  s2p2: Point.T,
): Result {
  const u = Point.sub(s1p2, s1p1)
  const v = Point.sub(s2p2, s2p1)
  const w = Point.sub(s1p1, s2p1)
  const d = Point.perpProd(u, v)

  if (fpop.isZero(d)) {
    // segments are parallel

    if (!fpop.areZero(Point.perpProd(u, w), Point.perpProd(v, w))) {
      // parallel but not collinear, so no intersection
      return { type: Existence.NO, point: null }
    }

    // segments are collinear or degenerate
    const du = Point.dotProd(u, u)
    const dv = Point.dotProd(v, v)

    if (fpop.areZero(du, dv)) {
      // both segments are points
      if (!Point.eq(s1p1, s2p1)) {
        // distinct points, so no intersection
        return { type: Existence.NO, point: null }
      }
      // they are the same point
      return { type: Existence.YES, point: s1p1 }
    }

    if (fpop.isZero(du)) {
      // s1 is a single point
      if (!Point.isInCollinearSegment(s2p1, s2p2, s1p1)) {
        // s1 is not in s2
        return { type: Existence.NO, point: null }
      }
      // s1 is in s2
      return { type: Existence.YES, point: s1p1 }
    }

    if (fpop.isZero(dv)) {
      if (!Point.isInCollinearSegment(s1p1, s1p2, s2p1)) {
        // s2 is not in s1
        return { type: Existence.NO, point: null }
      }
      // s2 is in s1
      return { type: Existence.YES, point: s2p1 }
    }

    // collinear segments, so now we look for an overlap
    // define t0 and t1 as endpoints of s1 in equation for s2
    let t0: number
    let t1: number
    const w2 = Point.sub(s1p2, s2p1)

    if (!fpop.isZero(v.x)) {
      t0 = w.x / v.x
      t1 = w2.x / v.x
    } else {
      t0 = w.y / v.y
      t1 = w2.y / v.y
    }

    if (fpop.gt(t0, t1)) {
      [t0, t1] = [t1, t0]
    }

    if (fpop.gt(t0, 1) || fpop.lt(t1, 0)) {
      return { type: Existence.NO, point: null }
    }

    t0 = fpop.isNegative(t0) ? 0 : t0 // clip to at least 0
    t1 = fpop.isPositive(t0) ? 1 : t1 // clip to at most 1

    if (fpop.eq(t0, t1)) {
      const point = Point.add(s2p1, Point.scalarMul(t0, v))
      return { type: Existence.YES, point }
    }

    // overlap in sub-segment
    // const point1 = Point.add(s2p1, Point.scalarMul(t0, v))
    // const point2 = Point.add(s2p1, Point.scalarMul(t1, v))
    return { type: Existence.OVERLAP, point: null }
  }

  // the segments are skew and may intersect in a point
  // get the intersect parameter for s1
  const si = Point.perpProd(v, w) / d
  if (fpop.lt(si, 0) || fpop.gt(si, 1)) return { type: Existence.NO, point: null }

  const ti = Point.perpProd(u, w) / d
  if (fpop.lt(ti, 0) || fpop.gt(ti, 1)) return { type: Existence.NO, point: null }

  const point = Point.add(s1p1, Point.scalarMul(si, u))
  return { type: Existence.YES, point }

}
