import {
  Application,
  Texture,
  Sprite,
  loader,
  Container,
  Graphics,
} from 'pixi.js'
import Player from './Player'
import enemy from '../assets/1.png'

const width = innerWidth
const height = innerHeight

const app = new Application({
  autoResize: true,
  backgroundColor: 0x1099bb,
  width,
  height,
})
document.body.append(app.view)

const center = {
  x: width / 2,
  y: height / 2,
}

app.renderer.resize(width, height)

// extension for chrome
globalThis.__PIXI_APP__ = app

// const sprite = Sprite.from(enemy)
// sprite.anchor.set(0.5)
// sprite.x = 0
// sprite.y = 0

// app.stage.addChild(sprite)

const world = new Container()
app.stage.addChild(world)

const player = new Player(center.x, center.y, 30, 0xde3249).draw()

app.ticker.add((delta) => {
  // player.x += 0.3 * delta
  // sprite.rotation += 0.02 * delta
  // sprite.x += 0.03
})

world.addChild(player)
