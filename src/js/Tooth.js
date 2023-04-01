import { Texture, Sprite } from 'pixi.js'
import toothTexture from '../assets/tooth.png'

export default class Tooth extends Sprite {
  constructor(x, y, size) {
    super(Texture.from(toothTexture))
    this.x = x
    this.y = y
    this.anchor.set(0.5)
    this.width = size
    this.height = size
    this.size = size
  }
}
