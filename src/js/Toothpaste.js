import { Graphics } from 'pixi.js'

export default class Toothpaste extends Graphics {
  constructor(x, y, size, color, velocity) {
    super()
    this.x = x
    this.y = y
    this.size = size
    this.color = color
    this.velocity = velocity
    this.draw()
  }

  draw() {
    this.beginFill(this.color)
    this.drawCircle(0, 0, this.size)
    this.endFill()
  }

  update() {
    this.x += this.velocity.x
    this.y += this.velocity.y
  }
}
