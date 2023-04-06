import { Application, Sprite } from 'pixi.js'
import Tooth from './Tooth'
import Toothpaste from './Toothpaste'
import Caries from './Caries'
import Particle from './Particle'
import bgTexture from '../assets/bg.jpg'
import randomColor from 'randomcolor'
import gsap from 'gsap'
import Sound from './Sound.js'

export default class Game {
  constructor() {
    this.width = innerWidth
    this.height = innerHeight
    this.center = {
      x: this.width / 2,
      y: this.height / 2,
    }

    this.isFirstTime = true
    this.canClick = false

    this.restartGameModal = document.querySelector('.restartGameModal')
    this.restartGameButton = document.querySelector('.restartGameButton')

    this.welcomeGameModal = document.querySelector('.welcomeGameModal')
    this.welcomeGameButton = document.querySelector('.welcomeGameButton')

    this.endGameScore = document.querySelector('.endGameScore')

    this.score = 0
    this.targetFps = 60
    this.targetFrameTime = 1000 / this.targetFps
    this.lastUpdateTime = performance.now()
    this.lastTimeCheck = performance.now()

    this.bullets = []
    this.enemies = []
    this.particles = []

    this.sound = new Sound()

    this.create()
    this.createBackground()
    this.createPlayer()
    this.addHandlers()
  }

  loop() {
    this.rafId = requestAnimationFrame(this.loop.bind(this))

    const now = performance.now()
    const deltaTime = now - this.lastUpdateTime

    if (deltaTime >= this.targetFrameTime) {
      this.update(deltaTime)
      this.app.renderer.render(this.world)
      this.lastUpdateTime = now
    }

    if (now - this.lastTimeCheck >= 1000) {
      this.createCaries()
      this.lastTimeCheck = now
    }
  }

  create() {
    this.app = new Application({
      autoResize: true,
      backgroundColor: 0x000000,
      width: this.width,
      height: this.height,
    })

    document.querySelector('#gameRoot').append(this.app.view)
    this.app.renderer.resize(this.width, this.height)

    this.world = this.app.stage
    this.world.name = 'world'
    this.world.alpha = 0

    this.sound.start.play()
    this.restartGameModal.style.display = 'none'

    // extension for chrome
    globalThis.__PIXI_APP__ = this.app
  }

  startGame() {
    const modal = this.isFirstTime ? this.welcomeGameModal : this.restartGameModal
    gsap.to(modal, {
      opacity: 0,
      duration: 1,
      onComplete: () => {
        modal.style.display = 'none'

        gsap.to(this.world, {
          alpha: 1,
          duration: 1,
          onComplete: () => {
            this.loop()
            this.canClick = true
            this.isFirstTime ? this.sound.start.stop() : this.sound.end.stop()
            this.sound.game.play()

            this.isFirstTime = false
          },
        })
      },
    })
  }

  restartGame() {
    this.bullets.forEach(b => b.destroy())
    this.enemies.forEach(e => e.destroy())
    this.particles.forEach(p => p.destroy())
    this.world.removeChild(...this.bullets, ...this.enemies, ...this.particles)
    this.bullets = []
    this.enemies = []
    this.particles = []
    this.score = 0
    document.querySelector('.score').innerHTML = this.score

    this.startGame()
  }

  endGame() {
    this.canClick = false
    this.sound.explosion.play()
    cancelAnimationFrame(this.rafId)

    gsap.to(this.world, {
      alpha: 0,
      duration: 1,
      onComplete: () => {
        this.endGameScore.innerHTML = this.score
        this.restartGameModal.style.display = 'flex'
        this.sound.game.stop()
        this.sound.end.play()
        gsap.to(this.restartGameModal, {
          opacity: 1,
          duration: 1
        })
      },
    })
  }

  createBackground() {
    this.bg = Sprite.from(bgTexture)
    this.bg.anchor.set(0.5)
    this.bg.width = this.width
    this.bg.height = this.height
    this.bg.position.set(this.center.x, this.center.y)
    this.bg.eventMode = 'static'

    this.world.addChild(this.bg)
  }

  createPlayer() {
    this.player = new Tooth(this.center.x, this.center.y, 60)

    this.world.addChild(this.player)
  }

  createCaries() {
    const size = Math.random() * (60 - 15) + 15

    let x
    let y

    if (Math.random() < 0.5) {
      x = Math.random() < 0.5 ? 0 - size : this.width + size
      y = Math.random() * this.height
    } else {
      x = Math.random() * this.width
      y = Math.random() < 0.5 ? 0 - size : this.height + size
    }

    const angle = Math.atan2(this.center.y - y, this.center.x - x)
    const velocity = {
      x: Math.cos(angle),
      y: Math.sin(angle),
    }

    const c = new Caries(x, y, size, velocity)
    this.enemies.push(c)
    this.world.addChild(c)
  }

  createBullet(x, y) {
    const speed = 5
    const angle = Math.atan2(y - this.center.y, x - this.center.x)
    const velocity = {
      x: Math.cos(angle),
      y: Math.sin(angle),
    }
    const t = new Toothpaste(this.center.x, this.center.y, 3, 'white', {
      x: velocity.x * speed,
      y: velocity.y * speed,
    })
    this.bullets.push(t)
    this.world.addChild(t)
    this.sound.shoot.play()
  }

  addHandlers() {
    this.bg.on('tap', (ev) => {
      if (!this.canClick) return
      this.createBullet(ev.x, ev.y)
    })
    this.bg.on('click', (ev) => {
      if (!this.canClick) return
      this.createBullet(ev.x, ev.y)
    })

    this.restartGameButton.addEventListener('click', () => {
      this.restartGame()
      this.sound.click.play()
    })

    this.welcomeGameButton.addEventListener('click', () => {
      this.startGame()
      this.sound.click.play()
    })
  }

  update() {
    this.bullets.forEach((bullet, index) => {
      bullet.update()

      if (
        bullet.x + bullet.size < 0 ||
        bullet.x - bullet.size > this.width ||
        bullet.y + bullet.size < 0 ||
        bullet.y - bullet.size > this.height
      ) {
        this.bullets.splice(index, 1)
        this.world.removeChild(bullet)
        bullet.destroy()
      }
    })

    this.enemies.forEach((enemy, eIndex) => {
      enemy.update()

      const dist = Math.hypot(this.player.x - enemy.x, this.player.y - enemy.y)

      if (dist - this.player.size / 2 - enemy.size / 2 < 1) {
        this.endGame()
      }

      this.bullets.forEach((bullet, bIndex) => {
        if (enemy.destroyed) return
        const dist = Math.hypot(bullet.x - enemy.x, bullet.y - enemy.y)
        if (dist - bullet.size - enemy.size < 1) {
          for (let i = 0; i < enemy.size; i++) {
            const p = new Particle(
              bullet.x,
              bullet.y,
              Math.random() * 2,
              randomColor(),
              {
                x: (Math.random() - 0.5) * (Math.random() * 6),
                y: (Math.random() - 0.5) * (Math.random() * 6),
              }
            )
            this.world.addChild(p)
            this.particles.push(p)
          }

          enemy.hit()
          this.sound.hit.play()
          this.bullets.splice(bIndex, 1)
          this.world.removeChild(bullet)
          if (!enemy.alive) {
            this.enemies.splice(eIndex, 1)

            this.world.removeChild(enemy)
            enemy.destroy()

            this.score += 100
            document.querySelector('.score').innerHTML = this.score
          }
        }
      })
    })

    this.particles.forEach((particle, index) => {
      if (particle.alpha < 0) {
        this.particles.splice(index, 1)
        this.world.removeChild(particle)
        particle.destroy()
      } else {
        particle.update()
      }
    })
  }
}