import * as Point from './point'
import { T } from './point'
import * as Line from './line'
import * as fpop from 'fpop'

export const enum Type1D {
  None = 0,
  Regular = 1 << 0,
  SP1 = 1 << 1,
  SP2 = 1 << 2,
}

/**
 * Assumes segment is not degenerate and given points are collinear.
 */
function isOnSegment (sp1: T, sp2: T, p: T): Type1D {
  if (Point.eq(sp1, p)) return Type1D.SP1
  if (Point.eq(sp2, p)) return Type1D.SP2
  if (fpop.neq(sp1.x, sp2.x)) {
    // segment is not vertical
    if (fpop.lt(sp1.x, p.x, sp2.x)) return Type1D.Regular
    if (fpop.gt(sp1.x, p.x, sp2.x)) return Type1D.Regular
  } else {
    // segment is vertical
    if (fpop.lte(sp1.y, p.y, sp2.y)) return Type1D.Regular
    if (fpop.gte(sp1.y, p.y, sp2.y)) return Type1D.Regular
  }
  return Type1D.None
}

export const enum Type {
  None,
  Point,
  Segment,
}

export const enum Flags {
  None = 0,
  Parallel = 1 << 0,
  Collinear = 1 << 1,
  U1 = 1 << 2,
  U2 = 1 << 3,
  V1 = 1 << 4,
  V2 = 1 << 5,
  DegenerateU = 1 << 6,
  DegenerateV = 1 << 7,
}

export function printFlags (flags: Flags) {
  const names: string[] = []
  if (flags & Flags.Parallel) names.push('Parallel')
  if (flags & Flags.Collinear) names.push('Collinear')
  if (flags & Flags.U1) names.push('U1')
  if (flags & Flags.U2) names.push('U2')
  if (flags & Flags.V1) names.push('V1')
  if (flags & Flags.V2) names.push('V2')
  if (flags & Flags.DegenerateU) names.push('DegenerateU')
  if (flags & Flags.DegenerateV) names.push('DegenerateV')
  return names.join(' ')
}

export function exists (
  v11: Point.T,
  v12: Point.T,
  v21: Point.T,
  v22: Point.T,
): Type {
  const line1 = Line.getGeneralFormFromSegment(v11, v12)
  const n1 = Line.equation(v21, line1)
  const n2 = Line.equation(v22, line1)
  if (fpop.arePositive(n1, n2) || fpop.areNegative(n1, n2)) return Type.None

  const line2 = Line.getGeneralFormFromSegment(v21, v22)
  const m1 = Line.equation(v11, line2)
  const m2 = Line.equation(v12, line2)
  if (fpop.arePositive(m1, m2) || fpop.areNegative(m1, m2)) return Type.Point

  if (fpop.eq(line1.a * line2.b, line2.a * line1.b)) return Type.Segment

  return Type.Point
}

export type Result = ({ flags: Flags }) & ({
  type: Type.None
} | {
  type: Type.Point
  point: Point.T
} | {
  type: Type.Segment
  point1: Point.T
  point2: Point.T
})

export function find (
  u1: Point.T,
  u2: Point.T,
  v1: Point.T,
  v2: Point.T,
  tu1: number = 0,
  tu2: number = 0,
  tv1: number = 0,
  tv2: number = 0,
): Result {
  const u = Point.sub(u2, u1)
  const v = Point.sub(v2, v1)
  const w = Point.sub(u1, v1)
  const d = Point.perpProd(u, v)

  if (fpop.isZero(d)) {
    // segments are parallel

    if (!fpop.areZero(Point.perpProd(u, w), Point.perpProd(v, w))) {
      // parallel but not collinear, so no intersection
      return {
        type: Type.None,
        flags: Flags.Parallel,
      }
    }

    // segments are collinear or degenerate
    const du = Point.dotProd(u, u)
    const dv = Point.dotProd(v, v)

    if (fpop.areZero(du, dv)) {
      // both segments are points
      if (!Point.eq(u1, v1)) {
        // distinct points, so no intersection
        return {
          type: Type.None,
          flags: Flags.Collinear | Flags.DegenerateU | Flags.DegenerateV,
        }
      }
      // they are the same point
      return {
        type: Type.Point,
        point: Point.clone(u1),
        flags: Flags.Collinear | Flags.DegenerateU | Flags.DegenerateV | Flags.U1 | Flags.U2 | Flags.V1 | Flags.V2,
      }
    }

    if (fpop.isZero(du)) {
      // s1 is a single point
      const result = isOnSegment(v1, v2, u1)
      let flags = Flags.DegenerateU
      if (result == Type1D.None) {
        return { type: Type.None, flags }
      }
      flags |= Flags.Collinear | Flags.U1 | Flags.U2
      if (result == Type1D.SP1) flags |= Flags.V1
      if (result == Type1D.SP2) flags |= Flags.V2
      return {
        type: Type.Point,
        point: Point.clone(u1),
        flags,
      }
    }

    if (fpop.isZero(dv)) {
      // s2 is a single point
      const result = isOnSegment(u1, u2, v1)
      let flags = Flags.DegenerateV
      if (result == Type1D.None) {
        return { type: Type.None, flags }
      }
      flags |= Flags.Collinear | Flags.V1 | Flags.V2
      if (result == Type1D.SP1) flags |= Flags.U1
      if (result == Type1D.SP2) flags |= Flags.U2
      return {
        type: Type.Point,
        point: Point.clone(v1),
        flags,
      }
    }

    // not degenerate

    // collinear segments, so now we look for an overlap
    // define t1 and t2 as endpoints of u in parametric equation for v
    let t1: number
    let t2: number
    const w2 = Point.sub(u2, v1)

    let flags: Flags = Flags.Collinear | Flags.Parallel

    if (!fpop.isZero(v.x)) {
      t1 = w.x / v.x
      t2 = w2.x / v.x
    } else {
      t1 = w.y / v.y
      t2 = w2.y / v.y
    }

    let flipped: boolean = false
    if (fpop.gt(t1, t2)) {
      [t1, t2] = [t2, t1]
      flipped = true
    }

    if (fpop.gt(t1, 1) || fpop.lt(t2, 0)) {
      // collinear, but no overlap
      return {
        type: Type.None,
        flags: Flags.Parallel | Flags.Collinear,
      }
    }


    if (fpop.lte(0, t1, 1)) flags |= !flipped ? Flags.U1 : Flags.U2
    if (fpop.lte(0, t2, 1)) flags |= !flipped ? Flags.U2 : Flags.U1

    t1 = fpop.lt(t1, 0) ? 0 : t1 // clip to at least 0
    t2 = fpop.gt(t2, 1) ? 1 : t2 // clip to at most 1

    if (fpop.eq(t1, 0) || fpop.eq(t2, 0)) flags |= Flags.V1
    if (fpop.eq(t1, 1) || fpop.eq(t2, 1)) flags |= Flags.V2

    if (fpop.eq(t1, t2)) {
      // collinear and touching at a point
      const point = Point.add(v1, Point.scalarMul(t1, v))
      return {
        type: Type.Point,
        point,
        flags,
      }
    }

    // overlap in sub-segment,
    // or even two identical segments
    const point1 = Point.add(v1, Point.scalarMul(t1, v))
    const point2 = Point.add(v1, Point.scalarMul(t2, v))
    return {
      type: Type.Segment,
      point1,
      point2,
      flags,
    }
  }

  // the segments are skew and may intersect in a point
  // get the intersect parameter for u
  const ui = Point.perpProd(v, w) / d
  if (fpop.lt(ui, 0) || fpop.gt(ui, 1)) {
    return {
      type: Type.None,
      flags: Flags.None,
    }
  }

  // get intersect parameter for v
  const vi = Point.perpProd(u, w) / d
  if (fpop.lt(vi, 0) || fpop.gt(vi, 1)) {
    return {
      type: Type.None,
      flags: Flags.None,
    }
  }

  const point = Point.add(u1, Point.scalarMul(ui, u))
  let flags: Flags = Flags.None

  if (Point.eq(point, u1)) flags |= Flags.U1
  if (Point.eq(point, u2)) flags |= Flags.U2
  if (Point.eq(point, v1)) flags |= Flags.V1
  if (Point.eq(point, v2)) flags |= Flags.V2

  return {
    type: Type.Point,
    point,
    flags,
  }

}
