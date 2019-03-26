import Object from './object'
import Point from './point'
import * as Geo from '../geometry'
import * as utils from '../utils'
import * as Colors from '../colors'

export interface PointAttributes {
  color: string
  size: number
  label: string
  isVisible: boolean
  isLocked: boolean
}

export const enum LineStyle {
  Solid,
}

export interface LineAttributes {
  color: string
  width: number
  style: LineStyle
  label: string
  isVisible: boolean
}

export const enum AreaShadeStyle {
  Solid,
}

export interface AreaAttributes {
  color: string
  style: AreaShadeStyle
}

export default class Scene {

  // Objects in the scene, looped for rendering.
  protected objects: Object[] = []

  protected get points (): Point[] {
    return this.objects.filter(utils.instanceOf(Point))
  }

  // Some objects aren't "physical", so we only compute them
  // on the fly on each change and let the renderer draw it.
  // For example, a bounding box of a polygon.
  protected virtualObjects: Array<() => Object[]> = [() => []]

  // State of the scene.
  protected _selectedPoint: Point | null = null
  protected _isMouseDown: boolean = false

  // Various settings around
  protected _isGridOn: boolean = true
  protected _gridSize: number = 20
  protected _gridColor: string = 'rgba(0, 116, 217, .2)'
  protected _snapToGrid: boolean = true
  protected _renderOffset: number = 0

  public get isGridOn (): boolean { return this._isGridOn }
  public get gridSize (): number { return this._gridSize }
  public get gridColor (): string { return this._gridColor }
  public get snapToGrid (): boolean { return this._snapToGrid }
  public get renderOffset (): number { return this._renderOffset }

  // Array of functions that get called when events happen
  protected onUpdateFns: Array<() => void> = []

  public constructor (protected ctx: CanvasRenderingContext2D) {
    this.addEventListeners()
  }

  public setSize (width: number, height: number): this {
    this.ctx.canvas.width = width
    this.ctx.canvas.height = height
    return this
  }

  public getWidth (): number {
    return this.ctx.canvas.width
  }

  public getHeight (): number {
    return this.ctx.canvas.height
  }

  public clear () {
    const w = this.getWidth()
    const h = this.getHeight()
    const ctx = this.ctx
    ctx.clearRect(0, 0, w, h)
  }

  public drawGrid (): this {
    this.ctx.save()
    const width = this.getWidth()
    const height = this.getHeight()
    const size = this.gridSize
    this.ctx.strokeStyle = this.gridColor
    const offset = this.renderOffset

    // Vertical lines
    for (let x = size; x < width; x += size) {
      this.ctx.beginPath()
      this.ctx.moveTo(x + offset, 0)
      this.ctx.lineTo(x + offset, height)
      this.ctx.stroke()
    }

    // Horizontal lines
    for (let y = size; y < height; y += size) {
      this.ctx.beginPath()
      this.ctx.moveTo(0, y + offset)
      this.ctx.lineTo(width, y + offset)
      this.ctx.stroke()
    }

    this.ctx.restore()
    return this
  }

  public drawObjects (): this {
    const offset = this.renderOffset
    this.objects.forEach(object => {
      if (this._selectedPoint == object) {
        this.ctx.save()
        const { x, y } = this._selectedPoint
        this.ctx.beginPath()
        this.ctx.fillStyle = Colors.Clrs.BLUE + 'AA'
        this.ctx.arc(x + offset, y + offset, 10, 0, 2 * Math.PI, false)
        this.ctx.fill()
        this.ctx.restore()
      }
      object.render(this.ctx)
    })
    return this
  }

  public drawVirtualObjects (): this {
    const offset = this.renderOffset
    const objectGroups = this.virtualObjects.map(fn => fn())
    for (const objectGroup of objectGroups) {
      for (const object of objectGroup) {
        object.setScene(this)
        object.render(this.ctx)
      }
    }
    return this
  }

  public drawAll (): this {
    if (this._isGridOn) this.drawGrid()
    this
      .drawObjects()
      .drawVirtualObjects()
    return this
  }

  public redraw () {
    this.clear()
    this.onUpdateFns.forEach(fn => fn())
    this.drawAll()
  }

  public add (...objects: Object[]): this {
    this.pushToObjectsArray(...objects)
    objects.forEach(obj => obj.setScene(this))
    return this
  }

  public addVirtualObjects (fn: () => Object[]): this {
    this.virtualObjects.push(fn)
    return this
  }

  public onUpdate (fn: () => void): this {
    this.onUpdateFns.push(fn)
    return this
  }

  /**
   * @internal
   */
  public pushToObjectsArray (...objects: Object[]): this {
    this.objects.push(...objects)
    return this
  }

  private moveSelectedPointTo (point: Geo.Point.T) {
    if (this._selectedPoint == null) return
    const result = this._snapToGrid
      ? Geo.Point.snapTo(point, this._gridSize)
      : point
    this._selectedPoint.set(result)
  }

  private updateNearestPointBasedOnCursor (cursor: Geo.Point.T) {
    const nearestPoint = Geo.Point.findClosestPoint(cursor, this.points)
    const result = nearestPoint.distance < 10 ? nearestPoint.point : null
    if (result == null) return this._selectedPoint = null
    const { isLocked } = result.getAttributes()
    if (isLocked) return this._selectedPoint = null
    this._selectedPoint = result
  }

  private onMouseMove = (event: MouseEvent) => {
    const cursor = { x: event.offsetX, y: event.offsetY }
    if (this._isMouseDown) {
      this.moveSelectedPointTo(cursor)
    } else {
      this.updateNearestPointBasedOnCursor(cursor)
    }
    this.redraw()
  }

  private onMouseDown = (event: MouseEvent) => {
    this._isMouseDown = true
    document.body.style.cursor = 'none'
  }

  private onMouseUp = (event: MouseEvent) => {
    this._isMouseDown = false
    document.body.style.cursor = 'default'
    this.redraw()
  }

  private addEventListeners () {
    const canvas = this.ctx.canvas
    canvas.addEventListener('mousemove', this.onMouseMove)
    canvas.addEventListener('mousedown', this.onMouseDown)
    document.addEventListener('mouseup', this.onMouseUp)
  }

  private removeEventListeners () {
    const canvas = this.ctx.canvas
    canvas.removeEventListener('mousemove', this.onMouseMove)
    canvas.removeEventListener('mousedown', this.onMouseDown)
    document.removeEventListener('mouseup', this.onMouseUp)
  }

  // Tweak various settings

  public gridOn (): this {
    this._isGridOn = true
    return this
  }

  public gridOff (): this {
    this._isGridOn = false
    return this
  }

  public gridToggle (): this {
    this._isGridOn = !this._isGridOn
    return this
  }

  public setGridSize (size: number): this {
    this._gridSize = size
    return this
  }

  public setGridColor (color: string): this {
    this._gridColor = color
    return this
  }

  public snapToGridOn (): this {
    this._snapToGrid = true
    return this
  }

  public snapToGridOff (): this {
    this._snapToGrid = false
    return this
  }

  public snapToGridToggle (): this {
    this._snapToGrid = !this._snapToGrid
    return this
  }

  public pointFiveHackOn (): this {
    this._renderOffset = 0.5
    return this
  }

  public pointFiveHackOff (): this {
    this._renderOffset = 0
    return this
  }

  public pointFiveHackToggle (): this {
    this._renderOffset = this._renderOffset == 0 ? 0.5 : 0
    return this
  }

  // Point

  private defaultPointAttributes: PointAttributes = {
    color: 'black',
    size: 2,
    label: '',
    isVisible: true,
    isLocked: false,
  }

  public setDefaultPointAttributes (attrbutes: PointAttributes): this {
    this.defaultPointAttributes = attrbutes
    return this
  }

  public getDefaultPointAttributes (): PointAttributes {
    return { ...this.defaultPointAttributes }
  }

  // Lines

  private defaultLineAttributes: LineAttributes = {
    color: 'black',
    width: 1,
    style: LineStyle.Solid,
    label: '',
    isVisible: true,
  }

  public setDefaultLineAttributes (attributes: LineAttributes): this {
    this.defaultLineAttributes = attributes
    return this
  }

  public getDefaultLineAttributes (): LineAttributes {
    return { ...this.defaultLineAttributes }
  }

  // Area

  private defaultAreaAttributes: AreaAttributes = {
    color: 'rgba(0, 0, 0, .2)',
    style: AreaShadeStyle.Solid,
  }

  public setDefaultAreaAttibutes (attributes: AreaAttributes): this {
    this.defaultAreaAttributes = attributes
    return this
  }

  public getDefaultAreaAttributes (): AreaAttributes {
    return { ...this.defaultAreaAttributes }
  }

}
