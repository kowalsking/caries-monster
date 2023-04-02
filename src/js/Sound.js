import { Howl } from 'howler'
import gameSound from '../assets/sound/game.wav'
import hitSound from '../assets/sound/hit.wav'
import shootSound from '../assets/sound/shoot2.wav'
import endSound from '../assets/sound/end.wav'
import startSound from '../assets/sound/start.wav'
import clickSound from '../assets/sound/click.wav'
import explosionSound from '../assets/sound/explosion.wav'

export default class Sound {
  constructor() {
    this.game = new Howl({
      src: gameSound,
      volume: 0.5,
      loop: true,
    })
    this.hit = new Howl({
      src: hitSound,
      volume: 0.5,
    })
    this.shoot = new Howl({
      src: shootSound,
      volume: 0.5,
    })
    this.end = new Howl({
      src: endSound,
      volume: 0.5,
      loop: true,
    })
    this.start = new Howl({
      src: startSound,
      volume: 0.5,
      loop: true
    })
    this.click = new Howl({
      src: clickSound,
      volume: 0.5,
    })
    this.explosion = new Howl({
      src: explosionSound,
      volume: 0.5,
    })
  }
}
