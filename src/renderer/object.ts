import Scene from './scene'

export default abstract class<T extends Record<string, any> = any> {

  private scene?: Scene

  protected abstract attributes: Partial<T>

  public abstract render (ctx: CanvasRenderingContext2D): void

  public setScene (scene: Scene): this {
    this.scene = scene
    return this
  }

  public getScene (): Scene {
    if (this.scene == null) {
      throw new Error(`Object not added to scene.`)
    }
    return this.scene
  }

}
