import { Point, Scene } from '../renderer'
import Rn from '../reactive-number'

const x = new Rn(10, document.querySelector('#input-x') as HTMLInputElement)
const y = x.add(40)

const point = new Point(x, y)

const canvas = document.createElement('canvas')
document.body.append(canvas)
const ctx = canvas.getContext('2d')!
const scene = new Scene(ctx)
  .setSize(600, 300)
  .add(point)
  .snapToGridOff()
  .drawAll()

document.querySelector('#print')!.addEventListener('click', () => {
  x.set(x => x + 10)
})

// console.log()

const spanX = document.querySelector('#x') as HTMLSpanElement
spanX.innerText = x.value.toString()
x.subscribe(value => {
  spanX.innerText = value.toString()
})

const spanY = document.querySelector('#y') as HTMLSpanElement
spanY.innerText = y.value.toString()
y.subscribe(value => {
  spanY.innerText = value.toString()
})
