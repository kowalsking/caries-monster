import { Graphics } from 'pixi.js'

export default class Particle extends Graphics {
  constructor(x, y, size, color, velocity) {
    super()
    this.x = x
    this.y = y
    this.size = size
    this.color = color
    this.velocity = velocity
    this.friction = 0.99
    this.draw()
  }

  draw() {
    this.beginFill(this.color, this.alpha)
    this.drawCircle(0, 0, this.size)
    this.endFill()
  }

  update() {
    this.velocity.x *= this.friction
    this.velocity.y *= this.friction
    this.x += this.velocity.x
    this.y += this.velocity.y
    this.alpha -= 0.01
  }
}
