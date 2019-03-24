import * as Point from './point'
import * as Line from './line'
import * as fpop from 'fpop'

export const enum Result {
  NO,
  YES,
  COLLINEAR,
}

export function test (
  v11: Point.T,
  v12: Point.T,
  v21: Point.T,
  v22: Point.T,
): Result {
  const line1 = Line.getGeneralFormFromSegment(v11, v12)
  const n1 = Line.equation(v21, line1)
  const n2 = Line.equation(v22, line1)
  if (fpop.arePositive(n1, n2) || fpop.areNegative(n1, n2)) return Result.NO

  const line2 = Line.getGeneralFormFromSegment(v21, v22)
  const m1 = Line.equation(v11, line2)
  const m2 = Line.equation(v12, line2)
  if (fpop.arePositive(m1, m2) || fpop.areNegative(m1, m2)) return Result.NO

  if (fpop.eq(line1.a * line2.b, line2.a * line1.b)) return Result.COLLINEAR

  return Result.YES
}
