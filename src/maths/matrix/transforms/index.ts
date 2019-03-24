export function StretchX (k: number): number[][] {
  return [[k, 0], [0, 1]]
}

export function StretchY (k: number): number[][] {
  return [[1, 0], [0, k]]
}

export function Stretch (k: number): number[][] {
  return [[k, 0], [0, k]]
}

export function Rotate (θ: number): number[][] {
  const c = Math.cos(θ)
  const s = Math.sin(θ)
  return [[c, -s], [s, c]]
}

export function ShearX (k: number): number[][] {
  return [[1, k], [0, 1]]
}

export function ShearY (k: number): number[][] {
  return [[1, 0], [k, 1]]
}

import * as homogenous from './homogenous'

export { homogenous }
