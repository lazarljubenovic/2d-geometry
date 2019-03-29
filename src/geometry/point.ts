import * as utils from '../utils'
import * as fpop from 'fpop'

export interface T {
  x: number
  y: number
}

export function New (x: number, y: number): T {
  return { x, y }
}

export function x (t: T): number {
  return t.x
}

export function y (t: T): number {
  return t.y
}

export function eq (...points: T[]): boolean {
  return fpop.eq(...points.map(x)) && fpop.eq(...points.map(y))
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

export function perpProd (v: T, w: T): number {
  return v.x * w.y - v.y * w.x
}

export function perp (u: T): T {
  const x = -u.y
  // noinspection JSSuspiciousNameCombination
  const y = u.x
  return { x, y }
}

export function isInCollinearSegment (s1: T, s2: T, p: T): boolean {
  if (fpop.neq(s1.x, s2.x)) {
    // segment is not vertical
    if (fpop.lte(s1.x, p.x, s2.x)) return true
    if (fpop.gte(s1.x, p.x, s2.x)) return true
  } else {
    // segment is vertical
    if (fpop.lte(s1.y, p.y, s2.y)) return true
    if (fpop.gte(s1.y, p.y, s2.y)) return true
  }
  return false
}
