import { GAME_HEIGHT, GAME_WIDTH } from '../../constants/GameConst'
import RoboConf from './RoboConf'

export default class Robo extends Phaser.Physics.Arcade.Sprite
{
    public health: number = 75

    public scraps: number = 2

    public takeDamage(damage: number)
    {
        this.health -= damage
        if (this.health <= 0)
        {
            this.disableBody(true, true)
            this.emit('died', this.x, this.y, this.scraps)
            this.removeAllListeners('died')
        }
    }

    public start(x: number, y: number, health: number = 75, conf: RoboConf = new RoboConf())
    {
        this.setSize(conf.sizeX, conf.sizeY)

        this.health = health
        this.scraps = Phaser.Math.Between(conf.minScraps, conf.maxScraps)

        this.setTexture(conf.texture)
        this.play(conf.anim)
        this.setFlipX(x > GAME_WIDTH * 0.5)

        this.enableBody(true, x, y, true, true)

        let vec = new Phaser.Math.Vector2(GAME_WIDTH * 0.5, GAME_HEIGHT * 0.5)
        vec = vec.subtract(new Phaser.Math.Vector2(x, y))
        vec = vec.normalize()
        this.setVelocity(vec.x * conf.speed, vec.y * conf.speed)
    }
}
