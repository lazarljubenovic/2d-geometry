import { getDimensions } from './algebra'

/**
 * Check if given parameter is a 2D matrix made of numbers.
 *
 * This means that all elements must be of type number, and that matrix is
 * in two dimensions. It also means that all elements of the matrix array
 * need to have the same length.
 *
 * @param matrix
 * @constructor
 */
export function isMatrix (matrix: number[][]): boolean {
  try {
    const firstRowLength = matrix[0].length
    return matrix.every(row => {
      return row.length == firstRowLength &&
        row.every(cell => {
          return typeof cell == 'number'
        })
    })
  } catch (e) {
    return false
  }
}

export function isSquareMatrix (matrix: number[][]): boolean {
  const [n, m] = getDimensions(matrix)
  return n == m
}
