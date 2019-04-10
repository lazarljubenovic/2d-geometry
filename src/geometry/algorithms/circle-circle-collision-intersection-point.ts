import * as Point from '../point'

export default function circleCircleCollisionIntersectionPoint (
  c1: Point.T,
  r1: number,
  v: Point.T,
  c2: Point.T,
  r2: number,
) {

  // debugger

  const c = Point.sub(c2, c1)

  const dotProd = Point.dotProd(v, c)
  if (dotProd <= 0) return null

  const vLen = Point.getLength(v)
  const p = dotProd / vLen

  const cLen = Point.getLength(c)
  const cLenSquared = cLen ** 2
  const pSquared = p ** 2
  const dSquared = cLenSquared - pSquared

  const sumOfRadii = r1 + r2
  const sumOfRadiiSquared = sumOfRadii ** 2
  if (dSquared >= sumOfRadiiSquared) return null

  const pMinusQSquared = sumOfRadiiSquared - dSquared
  const pMinusQ = Math.sqrt(pMinusQSquared)
  const q = p - pMinusQ

  if (q > vLen) return null

  return Point.add(c1, Point.setLength(v, q))

}
