export function identity(dimension: number): number[][] {
  return Array(dimension).fill(null)
    .map((_, i) => Array(dimension).fill(null)
      .map((__, j) => i == j ? 1 : 0))
}
