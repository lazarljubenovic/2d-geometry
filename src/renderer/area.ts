import Object from './object'
import { AreaAttributes, AreaShadeStyle } from './scene'
import { Point } from '../geometry'
import { override } from '../utils'

export default class extends Object<AreaAttributes> {

  protected attributes: Partial<AreaAttributes> = {
    color: undefined,
    style: undefined,
  }

  constructor (public points: Point.T[]) {
    super()
  }

  public set (points: Point.T[]): this {
    this.points = points
    return this
  }

  public getAttributes () {
    const defaultAttributes = this.getScene().getDefaultAreaAttributes()
    return override(defaultAttributes, this.attributes)
  }

  public render (ctx: CanvasRenderingContext2D): this {
    const attrs = this.getAttributes()

    ctx.save()
    ctx.fillStyle = attrs.color
    const [first, ...rest] = this.points
    ctx.moveTo(first.x + 0.5, first.y + 0.5)
    for (const point of rest) {
      ctx.lineTo(point.x + 0.5, point.y + 0.5)
    }
    ctx.lineTo(first.x + 0.5, first.y + 0.5)
    ctx.fill()
    ctx.restore()

    return this
  }

  public setColor (color: string): this {
    this.attributes.color = color
    return this
  }

  public setStyle (style: AreaShadeStyle): this {
    this.attributes.style = style
    return this
  }

}
