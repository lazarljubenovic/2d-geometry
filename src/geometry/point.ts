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

export function clone (t: T): T {
  return New(t.x, t.y)
}

export function eq (...points: T[]): boolean {
  return fpop.eq(...points.map(x)) && fpop.eq(...points.map(y))
}

export function polar (radius: number, angle: number) {
  const x = radius * Math.cos(angle)
  const y = radius * Math.sin(angle)
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

export const translate = add

export function translateX (...pointsOrXs: Array<number | T>) {
  let x: number = 0
  let y: number = 0
  for (const n of pointsOrXs) {
    if (typeof n == 'number') {
      x += n
    } else {
      x += n.x
      y += n.y
    }
  }
  return { x, y }
}

export function translateY (...pointsOrYs: Array<number | T>) {
  let x: number = 0
  let y: number = 0
  for (const n of pointsOrYs) {
    if (typeof n == 'number') {
      y += n
    } else {
      x += n.x
      y += n.y
    }
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

export function setLength (point: T, desiredLength: number): T {
  const currLength = getLength(point)
  const ratio = desiredLength / currLength
  return scalarMul(ratio, point)
}

export function setSegmentLength (pivot: T, point: T, desiredLength: number): T {
  const moved = sub(point, pivot)
  const scaled = setLength(moved, desiredLength)
  return add(scaled, pivot)
}

export function dotProd (a: T, b: T): number {
  return a.x * b.x + a.y * b.y
}

export function getDistance (a: T, b: T): number {
  const x = a.x - b.x
  const y = a.y - b.y
  return Math.hypot(x, y)
}

export function getLength (t: T): number {
  const { x, y } = t
  return Math.hypot(x, y)
}

export function getAngle (t: T): number {
  const { x, y } = t
  return Math.atan2(y, x)
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

export function perpWrt (point: T, pivot: T): T {
  const u  = sub(point, pivot)
  const uT = perp(u)
  return add(pivot, uT)
}

export function rotate (t: T, angle: number): T {
  const s = Math.sin(angle)
  const c = Math.cos(angle)

  const x = t.x * c + t.y * s
  const y = -t.x * s + t.y * c

  return { x, y }
}

export function rotateWrt (point: T, angle: number, pivot: T): T {
  const moved = sub(point, pivot)
  const rotated = rotate(moved, angle)
  const movedBack = add(rotated, pivot)
  return movedBack
}

export function toString (t: T): string {
  return `(${t.x}, ${t.y})`
}
