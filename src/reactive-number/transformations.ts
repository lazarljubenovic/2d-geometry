export type Op1 = (a: number) => number
export type Op2 = (a: number) => (b: number) => number

export const neg: Op1 = a => -a

export const add: Op2 = b => a => a + b
export const sub: Op2 = b => a => a - b
export const mul: Op2 = b => a => a * b
export const div: Op2 = b => a => a / b

export const pow: Op2 = b => a => a ** b
export const sq: Op1 = a => a ** 2

export const root: Op2 = b => a => a ** (1 / b)
export const sqrt: Op1 = Math.sqrt
export const cbrt: Op1 = root(3)

export const round: Op1 = Math.round
export const ceil: Op1 = Math.round
export const floor: Op1 = Math.floor
