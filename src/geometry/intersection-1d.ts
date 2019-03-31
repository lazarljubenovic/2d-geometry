import * as fpop from 'fpop'

function combine2<T> (f: (t: T) => T, g: (t: T) => T): (t: T) => T {
  return (t: T) => f(g(t))
}

function combine<T> (...fs: Array<(t: T) => T>): (t: T) => T {
  return fs.reduce(combine2, (t: T) => t)
}

export const enum Flags {
  DU = 1 << 0,
  DV = 1 << 1,
  U1 = 1 << 2,
  U2 = 1 << 3,
  V1 = 1 << 4,
  V2 = 1 << 5,
}

function fu (flag: Flags): Flags {
  if (flag == Flags.U1) return Flags.U2
  if (flag == Flags.U2) return Flags.U1
  return flag
}

function fv (flag: Flags): Flags {
  if (flag == Flags.V1) return Flags.V2
  if (flag == Flags.V2) return Flags.V1
  return flag
}

function fuv (flag: Flags): Flags {
  if (flag == Flags.DU) return Flags.DV
  if (flag == Flags.DV) return Flags.DU
  if (flag == Flags.U1) return Flags.V1
  if (flag == Flags.U2) return Flags.V2
  if (flag == Flags.V1) return Flags.U1
  /* if (flag == Flags.V2) */
  return Flags.U2
}

function f (flag: Flags, u: boolean, v: boolean, uv: boolean): Flags {
  const functions: Array<(flag: Flags) => Flags> = []
  if (u) functions.push(fu)
  if (v) functions.push(fv)
  if (uv) functions.push(fuv)
  const combined = combine(...functions)
  return combined(flag)
}

export default function analyze1d (
  u1: number,
  u2: number,
  v1: number,
  v2: number,
) {
  let u: boolean
  let v: boolean
  let uv: boolean

  if (u = (fpop.gt(u1, u2))) [u1, u2] = [u2, u1]
  if (v = (fpop.gt(v1, v2))) [v1, v2] = [v2, v1]
  if (uv = (fpop.gt(u1, v1))) [u1, u2, v1, v2] = [v1, v2, u1, u2]


}
