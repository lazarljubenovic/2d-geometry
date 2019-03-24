export function override<T extends Record<string, any>>(target: T, source: Partial<T>): T {
  const keys = Object.keys(source)
  for (const key of keys) {
    const val = source[key]
    if (val !== undefined) {
      target[key] = val
    }
  }
  return target
}

export function snapTo(number: number, snap: number): number {
  const mod = number % snap
  if (mod < snap / 2) return number - mod
  else return number + (snap - mod)
}

type Ctor<T = any> = { new(...args: any[]): T }
export function instanceOf<T>(ctor: Ctor<T>) {
  return function (x: any): x is T {
    return x instanceof ctor
  }
}

export function* pairwiseCircular<T> (array: T[]) {
  for (let i = 0; i < array.length - 1; i++) {
    yield [array[i], array[i + 1]]
  }
  yield [array[array.length - 1], array[0]]
}
