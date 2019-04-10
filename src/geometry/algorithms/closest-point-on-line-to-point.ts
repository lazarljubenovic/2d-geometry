import * as Point from '../point'

export default function closestPointOnLineToPoint (p1: Point.T, p2: Point.T, p: Point.T): Point.T {
  const line = Point.sub(p2, p1)
  const c = Point.sub(p, p1)
  const q = Point.dotProd(line, c) / Point.getDistance(p2, p1)
  return Point.add(p1, Point.setLength(line, q))
}
