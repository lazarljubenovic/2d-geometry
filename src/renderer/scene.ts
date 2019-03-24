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
  protected get points(): Point[] { return this.objects.filter(utils.instanceOf(Point)) }

  // State of the scene.
  protected selectedPoint: Point | null = null
  protected isMouseDown: boolean = false

  // Various settings around
  protected isGridOn: boolean = true
  protected gridSize: number = 20
  protected gridColor: string = 'rgba(0, 116, 217, .2)'
  protected snapToGrid: boolean = true

  // Array of functions that get called when events happen
  protected onUpdateFns: Array<() => void> = []

  public constructor(protected ctx: CanvasRenderingContext2D) {
    this.addEventListeners()
  }

  public setSize(width: number, height: number): this {
    this.ctx.canvas.width = width
    this.ctx.canvas.height = height
    return this
  }

  public getWidth(): number { return this.ctx.canvas.width }
  public getHeight(): number { return this.ctx.canvas.height }

  public clear() {
    const w = this.getWidth()
    const h = this.getHeight()
    const ctx = this.ctx
    ctx.clearRect(0, 0, w, h)
  }

  public drawGrid() {
    this.ctx.save()
    const width = this.getWidth()
    const height = this.getHeight()
    const size = this.gridSize
    this.ctx.strokeStyle = this.gridColor
  
    // Vertical lines
    for (let x = size; x < width; x += size) {
      this.ctx.beginPath()
      this.ctx.moveTo(x + 0.5, 0)
      this.ctx.lineTo(x + 0.5, height)
      this.ctx.stroke()
    }
  
    // Horizontal lines
    for (let y = size; y < height; y += size) {
      this.ctx.beginPath()
      this.ctx.moveTo(0, y + 0.5)
      this.ctx.lineTo(width, y + 0.5)
      this.ctx.stroke()
    }

    this.ctx.restore()
  }

  public drawObjects() {
    this.objects.forEach(object => {
      if (this.selectedPoint == object) {
        this.ctx.save()
        const { x, y } = this.selectedPoint
        this.ctx.beginPath()
        this.ctx.fillStyle = Colors.Clrs.BLUE + 'AA'
        this.ctx.arc(x, y, 10, 0, 2 * Math.PI, false)
        this.ctx.fill()
        this.ctx.restore()
      }
      object.render(this.ctx)
    })
  }

  public drawAll() {
    if (this.isGridOn) this.drawGrid()
    this.drawObjects()
  }

  public redraw() {
    this.clear()
    this.onUpdateFns.forEach(fn => fn())
    this.drawAll()
  }

  public add(...objects: Object[]): this {
    this.pushToObjectsArray(...objects)
    objects.forEach(obj => obj.setScene(this))
    return this
  }

  public onUpdate(fn: () => void): this {
    this.onUpdateFns.push(fn)
    return this
  }

  /**
   * @internal
   */
  public pushToObjectsArray(...objects: Object[]): this {
    this.objects.push(...objects)
    return this
  }

  private moveSelectedPointTo(point: Geo.Point.T) {
    if (this.selectedPoint == null) return
    const result = this.snapToGrid
      ? Geo.Point.snapTo(point, this.gridSize)
      : point
    this.selectedPoint.set(result)
  }

  private updateNearestPointBasedOnCursor(cursor: Geo.Point.T) {
    const nearestPoint = Geo.Point.findClosestPoint(cursor, this.points)
    const result = nearestPoint.distance < 10 ? nearestPoint.point : null
    if (result == null) return this.selectedPoint = null
    const { isLocked } = result.getAttributes()
    if (isLocked) return this.selectedPoint = null
    this.selectedPoint = result
  }

  private onMouseMove = (event: MouseEvent) => {
    const cursor = { x: event.offsetX, y: event.offsetY }
    if (this.isMouseDown) {
      this.moveSelectedPointTo(cursor)
    } else {
      this.updateNearestPointBasedOnCursor(cursor)
    }
    this.redraw()
  }

  private onMouseDown = (event: MouseEvent) => {
    this.isMouseDown = true
    document.body.style.cursor = 'none'
  }

  private onMouseUp = (event: MouseEvent) => {
    this.isMouseDown = false
    document.body.style.cursor = 'default'
    this.redraw()
  }

  private addEventListeners() {
    const canvas = this.ctx.canvas
    canvas.addEventListener('mousemove', this.onMouseMove)
    canvas.addEventListener('mousedown', this.onMouseDown)
    document.addEventListener('mouseup', this.onMouseUp)
  }

  private removeEventListeners() {
    const canvas = this.ctx.canvas
    canvas.removeEventListener('mousemove', this.onMouseMove)
    canvas.removeEventListener('mousedown', this.onMouseDown)
    document.removeEventListener('mouseup', this.onMouseUp)
  }

  // Tweak various settings

  public gridOn(): this {
    this.isGridOn = true
    return this
  }

  public gridOff(): this {
    this.isGridOn = false
    return this
  }

  public gridToggle(): this {
    this.isGridOn = !this.isGridOn
    return this
  }

  public setGridSize(size: number): this {
    this.gridSize = size
    return this
  }

  public setGridColor(color: string): this {
    this.gridColor = color
    return this
  }

  public snapToGridOn(): this {
    this.snapToGrid = true
    return this
  }

  public snapToGridOff(): this {
    this.snapToGrid = false
    return this
  }

  public snapToGridToggle(): this {
    this.snapToGrid = !this.snapToGrid
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

  public setDefaultPointAttributes(attrbutes: PointAttributes): this {
    this.defaultPointAttributes = attrbutes
    return this
  }

  public getDefaultPointAttributes(): PointAttributes {
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

  public setDefaultLineAttributes(attributes: LineAttributes): this {
    this.defaultLineAttributes = attributes
    return this
  }

  public getDefaultLineAttributes(): LineAttributes {
    return { ...this.defaultLineAttributes }
  }

  // Area

  private defaultAreaAttributes: AreaAttributes = {
    color: 'rgba(0, 0, 0, .2)',
    style: AreaShadeStyle.Solid,
  }

  public setDefaultAreaAttibutes(attributes: AreaAttributes): this {
    this.defaultAreaAttributes = attributes
    return this
  }

  public getDefaultAreaAttributes(): AreaAttributes {
    return { ...this.defaultAreaAttributes }
  }

}
