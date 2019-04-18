import { LineAttributes, LineStyle } from './scene'
import * as Geo from '../geometry'
import Object from './object'
import { override } from '../utils'
import * as fpop from 'fpop'

export default class Line extends Object<LineAttributes> {

  protected attributes: Partial<LineAttributes> = {}

  constructor (public p1: Geo.Point.T, public p2: Geo.Point.T) {
    super()
  }

  public getAttributes () {
    const defaultAttributes = this.getScene().getDefaultLineAttributes()
    return override(defaultAttributes, this.attributes)
  }

  public render (ctx: CanvasRenderingContext2D): this {
    // We cannot draw a line from coinciding points.
    if (Geo.Point.eq(this.p1, this.p2)) return this

    const attrs = this.getAttributes()
    if (!attrs.isVisible) return this

    const offset = this.getScene().renderOffset
    const w = this.getScene().getWidth()
    const h = this.getScene().getHeight()

    ctx.save()
    ctx.strokeStyle = attrs.stroke
    ctx.lineWidth = attrs.width
    if (attrs.strokeStyle == LineStyle.Dashed) ctx.setLineDash([5, 5])

    ctx.beginPath()

    if (fpop.eq(this.p1.x, this.p2.x)) {
      // Vertical lines are simple
      ctx.moveTo(this.p1.x + offset, offset)
      ctx.lineTo(this.p1.x + offset, h + offset)
    } else if (fpop.eq(this.p1.y, this.p2.y)) {
      // Horizontal lines are simple
      ctx.moveTo(offset, this.p1.y + offset)
      ctx.lineTo(w + offset, this.p1.y + offset)
    } else {
      // Skewed lines are also simple but needs a bit maths
      const k = (this.p2.y - this.p1.y) / (this.p2.x - this.p1.x)
      const n = this.p1.y - k * this.p1.x

      const topX = -n / k
      const bottomX = (h - n) / k
      const leftY = n
      const rightY = k * w + n

      const intersections: Geo.Point.T[] = []
      if (fpop.lte(0, topX, w)) intersections.push(Geo.Point.New(topX, 0))
      if (fpop.lte(0, bottomX, w)) intersections.push(Geo.Point.New(bottomX, h))
      if (fpop.lt(0, leftY, h)) intersections.push(Geo.Point.New(0, leftY))
      if (fpop.lt(0, rightY, h)) intersections.push(Geo.Point.New(w, rightY))

      if (intersections.length >= 2) {
        const [p1, p2] = intersections
        ctx.moveTo(p1.x + offset, p1.y + offset)
        ctx.lineTo(p2.x + offset, p2.y + offset)
      }
    }

    ctx.stroke()
    ctx.restore()

    return this
  }

  public stroke (color: string): this {
    this.attributes.stroke = color
    return this
  }

  public color (color: string): this { return this.stroke(color) }

  public width (width: number): this {
    this.attributes.width = width
    return this
  }

  public dashed (): this {
    this.attributes.strokeStyle = LineStyle.Dashed
    return this
  }

}
