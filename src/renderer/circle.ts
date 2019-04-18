import { CircleAttributes, CircleStyle } from './scene'
import * as Geo from '../geometry'
import Object from './object'
import { override } from '../utils'
import Rn from '../reactive-number'
import Point from './point'

export default class Circle extends Object<CircleAttributes> {

  protected attributes: Partial<CircleAttributes> = {}

  constructor (public c: Geo.Point.T | Point, public r: number | Rn) {
    super()
    if (r instanceof Rn) {
      r.subscribe(() => this.getScene().redraw())
    }
  }

  public getAttributes () {
    const defaultAttributes = this.getScene().getDefaultCircleAttributes()
    return override(defaultAttributes, this.attributes)
  }

  public render (ctx: CanvasRenderingContext2D): this {
    const attrs = this.getAttributes()
    if (!attrs.isVisible) return this

    const offset = this.getScene().renderOffset
    const cx = this.c.x.valueOf() + offset
    const cy = this.c.y.valueOf() + offset
    const r = this.r.valueOf() + offset

    ctx.save()
    ctx.strokeStyle = attrs.stroke
    ctx.fillStyle = attrs.fill
    ctx.lineWidth = attrs.width
    if (attrs.strokeStyle == CircleStyle.Dashed) ctx.setLineDash([5, 5])
    ctx.beginPath()
    ctx.arc(cx, cy, r, attrs.arcFrom, attrs.arcTo)
    ctx.fill()
    ctx.stroke()
    ctx.restore()

    return this
  }

  public stroke (color: string): this {
    this.attributes.stroke = color
    return this
  }

  public color (color: string): this { return this.stroke(color) }

  public fill (color: string): this {
    this.attributes.fill = color
    return this
  }

  public dashed (): this {
    this.attributes.strokeStyle = CircleStyle.Dashed
    return this
  }

  public visible (isVisible: boolean = true): this {
    this.attributes.isVisible = isVisible
    return this
  }

  public invisible (): this { return this.visible(false) }

  public toggleVisible (): this { return this.visible(!this.attributes.isVisible) }

  public arcFrom (from: number): this {
    this.attributes.arcFrom = from
    return this
  }

  public arcTo (to: number): this {
    this.attributes.arcTo = to
    return this
  }

  public arc (from: number, to: number): this { return this.arcFrom(from).arcTo(to) }

  public width (width: number): this {
    this.attributes.width = width
    return this
  }

}
