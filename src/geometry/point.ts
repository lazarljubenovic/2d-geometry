import * as utils from '../utils'

export interface T {
  x: number
  y: number
}

export function New (x: number, y: number): T {
  return { x, y }
}

export function add (...points: T[]): T {
  let x: number = 0
  let y: number = 0
  for (const point of points) {
    x += point.x
    y += point.y
  }
  return { x, y }
}

export function neg (point: T): T {
  const x = -point.x
  const y = -point.y
  return { x, y }
}

export function sub (first: T, ...rest: T[]): T {
  const right = neg(add(...rest))
  return add(first, right)
}

export function scalarMul (scalar: number, point: T): T {
  const x = scalar * point.x
  const y = scalar * point.y
  return { x, y }
}

export function dotProd (a: T, b: T): number {
  return a.x * b.x + a.y * b.y
}

export function getDistance (a: T, b: T): number {
  const x = a.x - b.x
  const y = a.y - b.y
  return Math.hypot(x, y)
}

export function snapTo (point: T, snap: number): T {
  const x = utils.snapTo(point.x, snap)
  const y = utils.snapTo(point.y, snap)
  return { x, y }
}

export function findClosestPoint<U extends T, V extends T> (reference: U, points: V[]) {
  let index = 0
  let distance = getDistance(reference, points[0])
  for (let i = 1; i < points.length; i++) {
    let d = getDistance(reference, points[i])
    if (d < distance) {
      distance = d
      index = i
    }
  }
  return { index, point: points[index], distance }
}
