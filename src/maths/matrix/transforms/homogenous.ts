export function translateX (dx: number): number[][] {
  return [[1, 0, dx], [0, 1, 0], [0, 0, 1]]
}

export function translateY (dy: number): number[][] {
  return [[1, 0, 0], [0, 1, dy], [0, 0, 1]]
}

export function translate (dx: number, dy: number): number[][] {
  return [[1, 0, dx], [0, 1, dy], [0, 0, 1]]
}

export function stretchX (k: number): number[][] {
  return [[k, 0, 0], [0, 1, 0], [0, 0, 1]]
}

export function stretchY (k: number): number[][] {
  return [[1, 0, 0], [0, k, 0], [0, 0, 1]]
}

export function stretch (k: number): number[][] {
  return [[k, 0, 0], [0, k, 0], [0, 0, 1]]
}

export function rotate (θ: number): number[][] {
  const c = Math.cos(θ)
  const s = Math.sin(θ)
  return [[c, -s, 0], [s, c, 0], [0, 0, 1]]
}

export function shearX (k: number): number[][] {
  return [[1, k, 0], [0, 1, 0], [0, 0, 1]]
}

export function shearY (k: number): number[][] {
  return [[1, 0, 0], [k, 1, 0], [0, 0, 1]]
}
