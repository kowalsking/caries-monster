import { Graphics } from 'pixi.js'

export default class Player {
  constructor(x, y, radius, color) {
    // super();
    this.x = x
    this.y = y
    this.radius = radius
    this.color = color
    this.graphics = new Graphics()
  }

  draw() {
    this.graphics.beginFill(this.color)
    this.graphics.drawCircle(this.x, this.y, this.radius)
    this.graphics.endFill()

    return this.graphics
  }
}
