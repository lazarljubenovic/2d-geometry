import Object from './object'
import * as Geo from '../geometry'
import { override } from '../utils'
import { PointAttributes } from './scene'
import Rn from '../reactive-number'

export default class Point extends Object<PointAttributes> {

  private _x: number | Rn
  private _y: number | Rn

  private transformers: Array<(point: Geo.Point.T) => Geo.Point.T> = []

  public get geo (): Geo.Point.T {
    const point = Geo.Point.New(this._x.valueOf(), this._y.valueOf())
    return this.transformers.reduce<Geo.Point.T>((acc, curr) => curr(acc), point)
  }

  public get x (): number {return this.geo.x }

  public get y (): number { return this.geo.y }

  protected attributes: Partial<PointAttributes> = {}

  constructor (existingPoint: Point)
  constructor (geometry: Geo.Point.T)
  constructor (x: number | Rn, y: number | Rn)
  constructor (first: Point | Geo.Point.T | number | Rn, second?: number | Rn) {
    super()
    if (second === undefined) {
      const geometry = first as any
      this._x = geometry.x.valueOf()
      this._y = geometry.y.valueOf()
    } else {
      const x = first as Rn | number
      const y = second as Rn | number
      if (typeof x != 'number') {
        x.subscribe(() => this.getScene().redraw())
      }
      if (typeof y != 'number') {
        y.subscribe(() => this.getScene().redraw())
      }
      this._x = x
      this._y = y
    }
  }

  public set (p: Geo.Point.T): this {
    if (this._x instanceof Rn) {
      this._x.set(p.x)
    } else {
      this._x = p.x
    }

    if (this._y instanceof Rn) {
      this._y.set(p.y)
    } else {
      this._y = p.y
    }
    return this
  }

  public getAttributes () {
    const defaultAttributes = this.getScene().getDefaultPointAttributes()
    return override(defaultAttributes, this.attributes)
  }

  public render (ctx: CanvasRenderingContext2D): this {
    const attrs = this.getAttributes()
    if (!attrs.isVisible) return this

    const offset = this.getScene().renderOffset
    const x = this._x.valueOf() + offset
    const y = this._y.valueOf() + offset

    ctx.save()
    ctx.fillStyle = attrs.stroke
    ctx.beginPath()
    ctx.arc(x, y, attrs.size, 0, 2 * Math.PI)

    if (attrs.label != '') {
      ctx.font = 'italic 12pt "Computer Modern", serif'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.strokeStyle = 'white'
      ctx.lineWidth = 2
      const distance = attrs.size + 10
      const labelOffsetX = distance * Math.cos(attrs.labelAngle)
      const labelOffsetY = distance * Math.sin(attrs.labelAngle)
      ctx.strokeText(attrs.label, x + labelOffsetX, y + labelOffsetY)
      ctx.fillText(attrs.label, x + labelOffsetX, y + labelOffsetY)
    }

    ctx.fill()
    ctx.restore()

    return this
  }

  // Transformers

  public translateX (dx: number | Rn): this {
    if (dx instanceof Rn) {
      dx.subscribe(() => this.getScene().redraw())
    }
    this.transformers.push(point => Geo.Point.New(point.x + dx.valueOf(), point.y))
    return this
  }

  // Setters

  public stroke (color: string): this {
    this.attributes.stroke = color
    return this
  }

  public fill (color: string): this {
    this.attributes.fill = color
    return this
  }

  public color (color: string): this {
    return this.stroke(color).fill(color)
  }

  public size (size: number): this {
    this.attributes.size = size
    return this
  }

  public label (label: string): this {
    this.attributes.label = label
    return this
  }

  public labelAngle (angleRad: number) {
    this.attributes.labelAngle = angleRad
    return this
  }

  public labelTop (): this { return this.labelAngle(3 * Math.PI / 2) }

  public labelLeft (): this { return this.labelAngle(Math.PI) }

  public labelRight (): this { return this.labelAngle(0) }

  public labelBottom (): this { return this.labelAngle(Math.PI / 2) }

  public labelTopLeft (): this { return this.labelAngle(5 * Math.PI / 4) }

  public labelTopRight (): this { return this.labelAngle(7 * Math.PI / 4) }

  public labelBottomLeft (): this { return this.labelAngle(3 * Math.PI / 4) }

  public labelBottomRight (): this { return this.labelAngle(Math.PI / 4) }

  public visible (isVisible: boolean = true): this {
    this.attributes.isVisible = isVisible
    return this
  }

  public invisible (): this { return this.visible(false) }

  public toggleVisible (): this { return this.visible(!this.attributes.isVisible) }

  public lock (isLocked: boolean = true): this {
    this.attributes.isLocked = isLocked
    return this
  }

  public unlock (): this { return this.lock(false) }

  public toggleLock (): this { return this.lock(!this.attributes.isLocked) }

}
