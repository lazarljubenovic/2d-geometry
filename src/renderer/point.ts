import Object from './object'
import { Point } from '../geometry'
import { override } from '../utils'
import { PointAttributes } from './scene'

export default class extends Object<PointAttributes> implements Point.T {

  protected attributes: Partial<PointAttributes> = {
    color: undefined,
    size: undefined,
    label: undefined,
    isVisible: undefined,
    isLocked: undefined,
  }

  constructor (public x: number, public y: number) {
    super()
  }

  public set (p: Point.T): this {
    this.x = p.x
    this.y = p.y
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
    const x = this.x + offset
    const y = this.y + offset

    ctx.save()
    ctx.fillStyle = attrs.color
    ctx.beginPath()
    ctx.arc(x, y, attrs.size, 0, 2 * Math.PI)

    if (attrs.label != '') {
      ctx.font = 'italic 12pt "Computer Modern", serif'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.strokeStyle = 'white'
      ctx.lineWidth = 2
      const distance = attrs.size + 10
      ctx.strokeText(attrs.label, x + distance, y)
      ctx.fillText(attrs.label, x + distance, y)
    }

    ctx.fill()
    ctx.restore()

    return this
  }

  // Setters

  public setColor (color: string): this {
    this.attributes.color = color
    return this
  }

  public setSize (size: number): this {
    this.attributes.size = size
    return this
  }

  public setLabel (label: string): this {
    this.attributes.label = label
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

  public lock (): this {
    this.attributes.isLocked = true
    return this
  }

  public unlock (): this {
    this.attributes.isLocked = false
    return this
  }

  public toggleLock (): this {
    this.attributes.isLocked = !this.attributes.isLocked
    return this
  }

}
