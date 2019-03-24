import * as Point from './point'
import * as fpop from 'fpop'

export interface T {
  xMin: number
  yMin: number
  xMax: number
  yMax: number
}

export function compute<U extends Point.T>(points: U[], pad: number = 5) {
  let xMin = points[0].x
  let yMin = points[0].y
  let xMax = points[0].x
  let yMax = points[0].y

  for (let i = 1; i < points.length; i++) {
    if (points[i].x < xMin) xMin = points[i].x
    if (points[i].x > xMax) xMax = points[i].x
    if (points[i].y < yMin) yMin = points[i].y
    if (points[i].y > yMax) yMax = points[i].y
  }

  return {
    xMin: xMin - pad,
    yMin: yMin - pad,
    xMax: xMax + pad,
    yMax: yMax + pad,
  }
}

export function isIn<U extends Point.T>({ x, y }: U, { xMin, yMin, xMax, yMax }: T) {
  return fpop.lte(xMin, x) &&
    fpop.lte(x, xMax) &&
    fpop.lte(yMin, y) &&
    fpop.lte(y, yMax)
}

export function getRayEndpoints(point: Point.T, aabb: T) {
  const top = Point.New(point.x, aabb.yMin)
  const bottom = Point.New(point.x, aabb.yMax)
  const left = Point.New(aabb.xMin, point.y)
  const right = Point.New(aabb.xMax, point.y)
  return { top, bottom, left, right }
}
