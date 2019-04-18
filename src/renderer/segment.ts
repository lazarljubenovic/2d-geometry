import Object from './object'
import * as Geo from '../geometry'
import { override } from '../utils'
import { LineStyle, SegmentAttributes } from './scene'
import * as its from '@lazarljubenovic/iterators'
import Point from './point'

export default class Segment extends Object<SegmentAttributes> {

  public static Polygon (points: Geo.Point.T[]): Segment[] {
    return [...its.pairwiseCircular(points)]
      .map(([p1, p2]) => new Segment(p1, p2))
  }

  public static FromTowardsWithLength (from: Point, towards: Point, length: number): Segment {
    const vec = Geo.Point.sub(towards, from)
    const vecAtLength = Geo.Point.setLength(vec, length)
    const p1 = from
    const p2 = Geo.Point.add(p1, vecAtLength)
    return new Segment(p1, p2)
  }

  protected attributes: Partial<SegmentAttributes> = {}

  constructor (private p1: Geo.Point.T | Point, private p2: Geo.Point.T | Point) {
    super()
  }

  public get geo () {
    return {
      p1: Geo.Point.New(this.p1.x.valueOf(), this.p1.y.valueOf()),
      p2: Geo.Point.New(this.p2.x.valueOf(), this.p2.y.valueOf()),
    }
  }

  public getAttributes () {
    const defaultAttributes = this.getScene().getDefaultSegmentAttributes()
    return override(defaultAttributes, this.attributes)
  }

  public render (ctx: CanvasRenderingContext2D): this {
    const attrs = this.getAttributes()
    if (!attrs.isVisible) return this

    const offset = this.getScene().renderOffset

    ctx.save()
    ctx.strokeStyle = attrs.stroke
    if (attrs.strokeStyle == LineStyle.Dashed) ctx.setLineDash([5, 5])
    ctx.lineWidth = attrs.width
    ctx.beginPath()

    ctx.moveTo(this.geo.p1.x + offset, this.geo.p1.y + offset)
    ctx.lineTo(this.geo.p2.x + offset, this.geo.p2.y + offset)

    if (attrs.isVector) {
      const angle = Math.PI / 12
      const length = 12

      const left = Geo.Point.setSegmentLength(this.geo.p2, Geo.Point.rotateWrt(this.geo.p1, angle, this.geo.p2), length)
      const right = Geo.Point.setSegmentLength(this.geo.p2, Geo.Point.rotateWrt(this.geo.p1, -angle, this.geo.p2), length)

      ctx.lineCap = 'butt'
      ctx.moveTo(left.x + offset, left.y + offset)
      ctx.lineTo(this.geo.p2.x + offset, this.geo.p2.y + offset)
      ctx.lineTo(right.x + offset, right.y + offset)
    }

    ctx.stroke()
    ctx.restore()

    if (attrs.label != '') {
      ctx.save()
      ctx.font = 'italic 12pt "Computer Modern", serif'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.strokeStyle = 'white'
      ctx.lineWidth = 2
      const center = Geo.Point.add(this.geo.p1, Geo.Point.scalarMul(attrs.labelPosition, Geo.Point.sub(this.geo.p2, this.geo.p1)))
      const offset = Geo.Point.polar(attrs.labelOffset, attrs.labelAngle)
      const labelPos = Geo.Point.add(center, offset)
      ctx.strokeStyle = 'white'
      ctx.strokeText(attrs.label, labelPos.x, labelPos.y)
      ctx.fillStyle = attrs.stroke
      ctx.fillText(attrs.label, labelPos.x, labelPos.y)
      ctx.restore()
    }

    return this
  }

  // Setters

  public stroke (color: string): this {
    this.attributes.stroke = color
    return this
  }

  public color (color: string): this { return this.stroke(color) }

  public label (label: string): this {
    this.attributes.label = label
    return this
  }

  public labelPosition (ratio: number): this {
    this.attributes.labelPosition = Math.min(1, Math.max(0, ratio))
    return this
  }

  public labelStart (): this { return this.labelPosition(0) }

  public labelNearStart (): this { return this.labelPosition(0.1) }

  public labelMiddle (): this { return this.labelPosition(0.5)}

  public labelNearEnd (): this { return this.labelPosition(0.9)}

  public labelEnd (): this { return this.labelPosition(1)}

  public labelAngle (angleRad: number): this {
    this.attributes.labelAngle = angleRad
    return this
  }

  public labelTop (): this { return this.labelAngle(3 * Math.PI / 2) }

  public labelLeft (): this { return this.labelAngle(Math.PI) }

  public labelRight (): this { return this.labelAngle(0) }

  public labelBottom (): this { return this.labelAngle(Math.PI / 2) }

  public labelOffset (offset: number): this {
    this.attributes.labelOffset = offset
    return this
  }

  public labelClose (): this { return this.labelOffset(10) }

  public labelFar (): this { return this.labelOffset(20) }

  public strokeStyle (style: LineStyle): this {
    this.attributes.strokeStyle = style
    return this
  }

  public dashed (): this { return this.strokeStyle(LineStyle.Dashed) }

  public width (width: number): this {
    this.attributes.width = width
    return this
  }

  public visible (isVisible: boolean = true): this {
    this.attributes.isVisible = isVisible
    return this
  }

  public invisible (): this { return this.visible(false) }

  public toggleVisible (): this { return this.visible(this.attributes.isVisible) }

  public asVector (v: boolean = true): this {
    this.attributes.isVector = v
    return this
  }

}
