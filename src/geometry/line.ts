import * as Point from './point'

export interface T {
  a: number
  b: number
  c: number
}

export function getGeneralFormFromSegment (p1: Point.T, p2: Point.T): T {
  const a = p2.y - p1.y
  const b = p1.x - p2.x
  const c = (p2.x * p1.y) - (p1.x * p2.y)
  return { a, b, c }
}

export function equation ({ x, y }: Point.T, { a, b, c }: T) {
  return a * x + b * y + c
}
