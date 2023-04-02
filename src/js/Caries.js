import { Sprite, Texture } from 'pixi.js'
import gsap from 'gsap'
import caries1 from '../assets/1.png'
import caries2 from '../assets/2.png'
import caries3 from '../assets/3.png'
import caries4 from '../assets/4.png'
import caries5 from '../assets/5.png'
import caries6 from '../assets/6.png'

const variants = [caries1, caries2, caries3, caries4, caries5, caries6]
const giveRandomTexture = () =>
  Texture.from(variants[Math.floor(Math.random() * variants.length)])

export default class Caries extends Sprite {
  constructor(x, y, size, velocity) {
    super(giveRandomTexture())
    this.x = x
    this.y = y
    this.size = size
    this.width = size
    this.height = size
    this.velocity = velocity
    this.anchor.set(0.5)
    this.alive = true
  }

  update() {
    this.x += this.velocity.x
    this.y += this.velocity.y
  }

  hit() {
    if (this.size > 30) {
      gsap.to(this.scale, {
        x: this.scale.x / 2,
        y: this.scale.y / 2,
        onStart: () => {
          this.size = this.width / 2
        }
      })
    } else {
      this.alive = false
    }
  }
}
