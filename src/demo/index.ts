import { Scene, Point, Area, Segment } from '../renderer'
import * as Colors from '../colors'
import { pairwiseCircular } from '../utils'

const canvas = document.createElement('canvas')
document.body.append(canvas)
const ctx = canvas.getContext('2d')!
const scene = new Scene(ctx)

const points = [
  new Point(460, 180),
  new Point(400, 240),
  new Point(860, 240),
  new Point(860, 280),
  new Point(400, 280),
  new Point(400, 400),
  new Point(240, 320),
  new Point(240, 200),
  new Point(400, 120),
]

const area = new Area(points)

const segments = [...pairwiseCircular(points)]
  .map(([p1, p2]) => new Segment(p1, p2))

const referentPoint = new Point(300, 200)
  .setSize(8)
  .setColor(Colors.Clrs.LIME)

scene
  .setSize(1000, 600)
  .add(...points, referentPoint, area, ...segments)
  .drawAll()
