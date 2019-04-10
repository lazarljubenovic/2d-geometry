import { CircleAttributes } from './scene'
import * as Geo from '../geometry'
import Object from './object'
import { override } from '../utils'

export default class Circle extends Object<CircleAttributes> {

  protected attributes: Partial<CircleAttributes> = {
    style: undefined,
    color: undefined,
  }

  constructor (public c: Geo.Point.T, public r: number) {
    super()
  }

  public getAttributes () {
    const defaultAttributes = this.getScene().getDefaultCircleAttributes()
    return override(defaultAttributes, this.attributes)
  }

  public render (ctx: CanvasRenderingContext2D): this {
    const attrs = this.getAttributes()

    const offset = this.getScene().renderOffset
    const cx = this.c.x + offset
    const cy = this.c.y + offset
    const r = this.r + offset

    ctx.save()
    ctx.strokeStyle = attrs.color
    ctx.beginPath()
    ctx.arc(cx, cy, r, 0, 2 * Math.PI)
    ctx.stroke()
    ctx.restore()

    return this
  }

  public setColor (color: string): this {
    this.attributes.color = color
    return this
  }

}
