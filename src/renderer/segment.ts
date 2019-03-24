import Object from './object'
import { Point } from '../geometry'
import { override } from '../utils'
import { LineAttributes, LineStyle } from './scene'
import PointObject from './point'

export default class extends Object<LineAttributes> {

  protected attributes: Partial<LineAttributes> = {
    color: undefined,
    isVisible: undefined,
    label: undefined,
    style: undefined,
    width: undefined,
  }

  constructor(public p1: PointObject, public p2: PointObject) {
    super()
  }

  public set(p1: Point.T, p2: Point.T): this {
    this.p1.set(p1)
    this.p2.set(p2)
    return this
  }

  public getAttributes() {
    const defaultAttributes = this.getScene().getDefaultLineAttributes()
    return override(defaultAttributes, this.attributes)
  }

  public render (ctx: CanvasRenderingContext2D): this {
    const attrs = this.getAttributes()
    if (!attrs.isVisible) return this

    ctx.save()
    ctx.strokeStyle = attrs.color
    ctx.lineWidth = attrs.width
    ctx.beginPath()
    ctx.moveTo(this.p1.x, this.p1.y)
    ctx.lineTo(this.p2.x, this.p2.y)
    ctx.stroke()
    ctx.restore()

    return this
  }

  // Setters

  public setColor (color: string): this {
    this.attributes.color = color
    return this
  }

  public setLabel (label: string): this {
    this.attributes.label = label
    return this
  }

  public setStyle (style: LineStyle): this {
    this.attributes.style = style
    return this
  }

  public setWidth (width: number): this {
    this.attributes.width = width
    return this
  }

  public setVisible(): this {
    this.attributes.isVisible = true
    return this
  }

  public setInvisible(): this {
    this.attributes.isVisible = false
    return this
  }

  public toggleVisibility(): this {
    this.attributes.isVisible = !this.attributes.isVisible
    return this
  }

}
