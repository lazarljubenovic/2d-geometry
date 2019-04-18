import * as t from './transformations'

interface Subscription {
  unsubscribe (): void
}

interface Listener {
  (value: number): void
}

export default class Rn {

  private _value: number
  private subscriptions: Array<Subscription> = []
  private listeners: Array<Listener> = []
  // private transformations: Array<t.Op1> = []
  private _inputEl?: HTMLInputElement

  public constructor (value: number, inputEl?: HTMLInputElement) {
    this._value = value
    if (inputEl != null) this.inputEl(inputEl)
  }

  public inputEl (inputEl: HTMLInputElement): this {
    if (this._inputEl != null) throw new Error(`Input already exists`)
    this._inputEl = inputEl
    this._inputEl.addEventListener('input', () => {
      this.set(this._inputEl!.valueAsNumber)
    })
    this._inputEl.valueAsNumber = this.value
    return this
  }

  public set (value: number | ((currentValue: number) => number)): this {
    if (typeof value == 'number') {
      this._value = value
    } else {
      this._value = value(this._value)
    }
    // this.transformations = []
    if (this._inputEl != null) this._inputEl.valueAsNumber = this.value
    this.notifyListeners()
    return this
  }

  public valueOf (): number {
    // return this.transformations.reduce((acc, curr) => {
    //   return curr(acc)
    // }, this._value)
    return this._value
  }

  public get value (): number {
    return this.valueOf()
  }

  public subscribe (listener: (value: number) => void): Subscription {
    this.listeners.push(listener)
    return {
      unsubscribe: () => {
        this.unsubscribe(listener)
      },
    }
  }

  public unsubscribe (listener: (value: number) => void): this {
    const index = this.listeners.indexOf(listener)
    this.listeners.splice(index)
    return this
  }

  public destroy () {
    this.listeners = []
    this.subscriptions.forEach(sub => sub.unsubscribe())
    this.subscriptions = []
  }

  private notifyListeners () {
    this.listeners.forEach(listener => listener(this.value))
  }

  // Operations

  private op1 (op: t.Op1): Rn {
    const rn = new Rn(this.value)
    this.subscribe(value => rn.set(op(value)))
    return rn
  }

  private op2 (arg2: number | Rn, op: t.Op2): Rn {
    const rn = new Rn(op(arg2.valueOf())(this.value))
    if (typeof arg2 == 'number') {
      this.subscribe(value => rn.set(op(arg2)(value)))
    } else {
      arg2.subscribe(b => {
        rn.set(op(b)(rn.value))
      })
    }
    return rn
  }

  // unary

  public neg (): Rn {
    return this.op1(t.neg)
  }

  public round (): Rn {
    return this.op1(t.round)
  }

  // binary

  public add (number: number): Rn
  public add (rn: Rn): Rn
  public add (x: number | Rn): Rn {
    return this.op2(x, t.add)
  }

  public sub (number: number): Rn
  public sub (rn: Rn): Rn
  public sub (x: number | Rn): Rn {
    return this.op2(x, t.sub)
  }

  public mul (number: number): Rn
  public mul (rn: Rn): Rn
  public mul (x: number | Rn): Rn {
    return this.op2(x, t.mul)
  }

  public div (number: number): Rn
  public div (rn: Rn): Rn
  public div (x: number | Rn): Rn {
    return this.op2(x, t.div)
  }

}
