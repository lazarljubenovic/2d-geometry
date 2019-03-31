import * as Point from './point'
import * as fpop from 'fpop'

export function general (
  u1: Point.T,
  u: Point.T,
  a1: number,
  ai1: boolean,
  a2: number,
  ai2: boolean,
  v1: Point.T,
  v: Point.T,
  b1: number,
  bi1: boolean,
  b2: number,
  bi2: boolean,
): Point.T | null {
  const w = Point.sub(u1, v1)
  const d = Point.perpProd(v, u)

  // collinear
  if (fpop.isZero(d)) return null

  const wu = Point.perpProd(w, u)
  const wv = Point.perpProd(w, v)
  const a = wv / d
  const b = wu / d

  const op_a1 = ai1 ? fpop.lte2 : fpop.lt2
  const op_a2 = ai2 ? fpop.lte2 : fpop.lt2
  const op_b1 = bi1 ? fpop.lte2 : fpop.lt2
  const op_b2 = bi2 ? fpop.lte2 : fpop.lt2
  if (op_a1(a1, a) && op_a2(a, a2) && op_b1(b1, b) && op_b2(b, b2)) {
    return Point.add(u1, Point.scalarMul(a, u))
  }
  return null
}

export function segmentSegment (u1: Point.T, u2: Point.T, v1: Point.T, v2: Point.T, inclusive: boolean): Point.T | null {
  const u = Point.sub(u2, u1)
  const v = Point.sub(v2, v1)
  return general(u1, u, 0, inclusive, 1, inclusive, v1, v, 0, inclusive, 1, inclusive)
}

export function segmentSegmentInclusive (u1: Point.T, u2: Point.T, v1: Point.T, v2: Point.T): Point.T | null {
  return segmentSegment(u1, u2, v1, v2, true)
}

export function segmentSegmentExclusive (u1: Point.T, u2: Point.T, v1: Point.T, v2: Point.T): Point.T | null {
  return segmentSegment(u1, u2, v1, v2, false)
}

export function raySegment (u1: Point.T, u: Point.T, v1: Point.T, v2: Point.T, inclusive: boolean): Point.T | null {
  const v = Point.sub(v2, v1)
  return general(u1, u, 0, inclusive, Infinity, false, v1, v, 0, inclusive, 1, inclusive)
}

export function raySegmentInclusive (u1: Point.T, u: Point.T, v1: Point.T, v2: Point.T): Point.T | null {
  return raySegment(u1, u, v1, v2, true)
}

export function raySegmentExclusive (u1: Point.T, u: Point.T, v1: Point.T, v2: Point.T): Point.T | null {
  return raySegment(u1, u, v1, v2, false)
}
