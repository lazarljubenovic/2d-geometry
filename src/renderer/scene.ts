import Object from './object'
import Point from './point'
import * as Geo from '../geometry'
import * as utils from '../utils'
import * as Colors from '../colors'

export interface PointAttributes {
  stroke: string
  fill: string
  size: number
  label: string
  labelAngle: number
  isVisible: boolean
  isLocked: boolean
}

export const enum LineStyle {
  Solid,
  Dashed,
}

export interface LineAttributes {
  stroke: string
  width: number
  strokeStyle: LineStyle
  isVisible: boolean
}

export interface SegmentAttributes {
  stroke: string
  width: number
  strokeStyle: LineStyle
  isVisible: boolean
  label: string
  labelPosition: number // 0 to 1
  labelAngle: number
  labelOffset: number
  isVector: boolean
}

export const enum AreaShadeStyle {
  Solid,
}

export interface AreaAttributes {
  fill: string
  fillStyle: AreaShadeStyle
}

export const enum CircleStyle {
  Solid,
  Dashed,
}

export interface CircleAttributes {
  stroke: string
  fill: string
  strokeStyle: CircleStyle
  isVisible: boolean
  arcFrom: number
  arcTo: number
  width: number
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
  protected _gridOffsetX: number = 0
  protected _gridOffsetY: number = 0
  protected _gridSize: number = 20
  protected _gridColor: string = 'rgba(0, 116, 217, .2)'
  protected _snapToGrid: boolean = true
  protected _renderOffset: number = 0

  public get isGridOn (): boolean {
    return this._isGridOn
  }

  public get gridOffsetX (): number {
    return this._gridOffsetX
  }

  public get gridOffsetY (): number {
    return this._gridOffsetY
  }

  public get gridSize (): number {
    return this._gridSize
  }

  public get gridColor (): string {
    return this._gridColor
  }

  public get snapToGrid (): boolean {
    return this._snapToGrid
  }

  public get renderOffset (): number {
    return this._renderOffset
  }

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

  public getPoints (): Geo.Point.T[] {
    const w = this.getWidth()
    const h = this.getHeight()
    return [
      Geo.Point.New(0, 0),
      Geo.Point.New(0, h),
      Geo.Point.New(w, h),
      Geo.Point.New(w, 0),
    ]
  }

  public clear (): this {
    const w = this.getWidth()
    const h = this.getHeight()
    this.ctx.clearRect(0, 0, w, h)
    return this
  }

  public drawGrid (): this {
    this.ctx.save()
    const width = this.getWidth()
    const height = this.getHeight()
    const size = this.gridSize
    this.ctx.strokeStyle = this.gridColor
    const offset = this.renderOffset

    // Vertical lines
    for (let x = this.gridOffsetX; x <= width; x += size) {
      this.ctx.beginPath()
      this.ctx.moveTo(x + offset, 0)
      this.ctx.lineTo(x + offset, height)
      this.ctx.stroke()
    }

    // Horizontal lines
    for (let y = this.gridOffsetY; y <= height; y += size) {
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
        const { x, y } = this._selectedPoint.geo
        this.ctx.beginPath()
        this.ctx.fillStyle = this._selectedPoint.getAttributes().stroke + 'BB'
        this.ctx.arc(x.valueOf() + offset, y.valueOf() + offset, 10, 0, 2 * Math.PI, false)
        this.ctx.fill()
        this.ctx.restore()
      }
      object.render(this.ctx)
    })
    return this
  }

  public drawVirtualObjects (): this {
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

  public redraw (): this {
    this.clear()
    this.onUpdateFns.forEach(fn => fn())
    this.drawAll()
    return this
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

  private updateNearestPointBasedOnCursor (cursor: Geo.Point.T): boolean {
    if (this.points.length == 0) return false
    const nearestPointInfo = Geo.Point.findClosestPoint(cursor, this.points.map(p => p.geo))
    const nearestPoint = this.points[nearestPointInfo.index]
    const result = nearestPointInfo.distance < 10 ? nearestPoint : null
    if (result == null) {
      if (this._selectedPoint == null) return false
      this._selectedPoint = null
      return true
    }

    const { isLocked } = result.getAttributes()
    if (isLocked) {
      if (this._selectedPoint == null) return false
      this._selectedPoint = null
      return true
    }

    if (this._selectedPoint == result) return false
    this._selectedPoint = result
    return true
  }

  private onMouseMove = (event: MouseEvent) => {
    const cursor = { x: event.offsetX, y: event.offsetY }
    if (this._isMouseDown && this._selectedPoint != null) {
      this.moveSelectedPointTo(cursor)
      this.redraw()
    } else {
      const didChange = this.updateNearestPointBasedOnCursor(cursor)
      if (didChange) {
        this.redraw()
      }
    }
  }

  private onMouseDown = (event: MouseEvent) => {
    this._isMouseDown = true
  }

  private onMouseUp = (event: MouseEvent) => {
    if (this._isMouseDown) {
      this.redraw()
    }
    this._isMouseDown = false
  }

  private addEventListeners (): this {
    const canvas = this.ctx.canvas
    canvas.addEventListener('mousemove', this.onMouseMove)
    canvas.addEventListener('mousedown', this.onMouseDown)
    document.addEventListener('mouseup', this.onMouseUp)
    return this
  }

  private removeEventListeners (): this {
    const canvas = this.ctx.canvas
    canvas.removeEventListener('mousemove', this.onMouseMove)
    canvas.removeEventListener('mousedown', this.onMouseDown)
    document.removeEventListener('mouseup', this.onMouseUp)
    return this
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

  public setGridOffset (x: number, y: number): this {
    this._gridOffsetX = x
    this._gridOffsetY = y
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
    stroke: Colors.Clrs.BLACK,
    fill: Colors.Clrs.BLACK,
    size: 2,
    label: '',
    labelAngle: 0,
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

  // Line

  private defaultLineAttributes: LineAttributes = {
    stroke: Colors.Clrs.BLACK,
    width: 1,
    strokeStyle: LineStyle.Solid,
    isVisible: true,
  }

  public setDefaultLineAttributes (attributes: LineAttributes): this {
    this.defaultLineAttributes = attributes
    return this
  }

  public getDefaultLineAttributes (): LineAttributes {
    return { ...this.defaultLineAttributes }
  }

  // Segment

  private defaultSegmentAttributes: SegmentAttributes = {
    stroke: Colors.Clrs.BLACK,
    width: 1,
    strokeStyle: LineStyle.Solid,
    label: '',
    labelAngle: Math.PI / 2,
    labelOffset: 0,
    labelPosition: 0.5,
    isVisible: true,
    isVector: false,
  }

  public setDefaultSegmentAttributes (attributes: SegmentAttributes): this {
    this.defaultSegmentAttributes = attributes
    return this
  }

  public getDefaultSegmentAttributes (): SegmentAttributes {
    return { ...this.defaultSegmentAttributes }
  }

  // Area

  private defaultAreaAttributes: AreaAttributes = {
    fill: 'rgba(0, 0, 0, .2)',
    fillStyle: AreaShadeStyle.Solid,
  }

  public setDefaultAreaAttributes (attributes: AreaAttributes): this {
    this.defaultAreaAttributes = attributes
    return this
  }

  public getDefaultAreaAttributes (): AreaAttributes {
    return { ...this.defaultAreaAttributes }
  }

  // Circle

  private defaultCircleAttributes: CircleAttributes = {
    stroke: 'rgba(0, 0, 0)',
    fill: 'transparent',
    strokeStyle: CircleStyle.Solid,
    isVisible: true,
    arcFrom: 0,
    arcTo: 2 * Math.PI,
    width: 1,
  }

  public setDefaultCircleAttributes (attributes: CircleAttributes): this {
    this.defaultCircleAttributes = attributes
    return this
  }

  public getDefaultCircleAttributes (): CircleAttributes {
    return { ...this.defaultCircleAttributes }
  }

}
