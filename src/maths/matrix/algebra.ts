import { isMatrix } from './checks'

// NOTE: Works only with 2D matrices
export function getDimensions (matrix: number[][]): number[] {
  if (!isMatrix(matrix)) {
    throw `Not a matrix: ${JSON.stringify(matrix)}`
  }
  const numberOfRows = matrix.length
  const numberOfColumns = matrix[0].length
  return [numberOfRows, numberOfColumns]
}

export function mul (a: number[][], b: number[][]): number[][] {
  let result: number[][] = Array(a.length).fill(null).map(_ => [])
  for (let row = 0; row < a.length; row++) {
    for (let col = 0; col < b[0].length; col++) {
      let sum = 0
      for (let inner = 0; inner < b.length; inner++) {
        sum += a[row][inner] * b[inner][col]
      }
      result[row][col] = sum
    }
  }
  return result
}

export function transpose (matrix: number[][]): number[][] {
  return matrix[0].map((_, i) => matrix.map(x => x[i]))
}

/**
 * Assumes that matrix has the following form.
 *
 * a c e
 * b d f
 * 0 0 1
 *
 * @param matrix
 * @constructor
 */
export function homogenousInverse (matrix: number[][]): number[][] {
  const [
    [a, c, e],
    [b, d, f],
  ] = matrix
  const λ = 1 / (a * d - b * c)
  return [
    [d, -c, c * f - d * e].map(el => el * λ),
    [-b, a, b * e - a * f].map(el => el * λ),
    [0, 0, 1],
  ]
}
