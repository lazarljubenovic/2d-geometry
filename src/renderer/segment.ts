import Object from './object'
import { Point } from '../geometry'
import { override } from '../utils'
import { LineAttributes, LineStyle } from './scene'
import PointObject from './point'
import * as its from '@lazarljubenovic/iterators'

export default class Segment extends Object<LineAttributes> {

  public static Polygon (points: Point.T[]): Segment[] {
    return [...its.pairwiseCircular(points)]
      .map(([p1, p2]) => new Segment(p1, p2))
  }

  protected attributes: Partial<LineAttributes> = {
    color: undefined,
    isVisible: undefined,
    isVector: undefined,
    label: undefined,
    style: undefined,
    width: undefined,
  }

  constructor (public p1: Point.T, public p2: Point.T) {
    super()
  }

  public set (p1: Point.T, p2: Point.T): this {
    this.p1.x = p1.x
    this.p1.y = p1.y
    this.p2.x = p2.x
    this.p2.y = p2.y
    return this
  }

  public getAttributes () {
    const defaultAttributes = this.getScene().getDefaultLineAttributes()
    return override(defaultAttributes, this.attributes)
  }

  public render (ctx: CanvasRenderingContext2D): this {
    const attrs = this.getAttributes()
    if (!attrs.isVisible) return this

    const offset = this.getScene().renderOffset

    ctx.save()
    ctx.strokeStyle = attrs.color
    ctx.lineWidth = attrs.width
    ctx.beginPath()
    ctx.moveTo(this.p1.x + offset, this.p1.y + offset)
    ctx.lineTo(this.p2.x + offset, this.p2.y + offset)

    if (this.attributes.isVector) {
      const angle = Math.PI / 12
      const length = 12

      const left = Point.setSegmentLength(this.p2, Point.rotateWrt(this.p1, angle, this.p2), length)
      const right = Point.setSegmentLength(this.p2, Point.rotateWrt(this.p1, -angle, this.p2), length)

      ctx.lineCap = 'butt'
      ctx.moveTo(left.x + offset, left.y + offset)
      ctx.lineTo(this.p2.x + offset, this.p2.y + offset)
      ctx.lineTo(right.x + offset, right.y + offset)
    }

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

  public setVisible (): this {
    this.attributes.isVisible = true
    return this
  }

  public setInvisible (): this {
    this.attributes.isVisible = false
    return this
  }

  public toggleVisibility (): this {
    this.attributes.isVisible = !this.attributes.isVisible
    return this
  }

  public asVector (v: boolean = true): this {
    this.attributes.isVector = v
    return this
  }

}
