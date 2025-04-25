import { GAME_HEIGHT, GAME_WIDTH } from '../../constants/GameConst'
import HealthBar from '../user-interfaces/HealthBar'
import RoboConf from './RoboConf'

export default class Robo extends Phaser.Physics.Arcade.Sprite
{
    public maxHealth: number = 75
    public health: number = 75

    public scraps: number = 2

    private hpBar: HealthBar

    constructor (scene: Phaser.Scene, x: number, y: number, texture: string)
    {
        super(scene, x, y, texture)
        
        this.hpBar = scene.add.existing(new HealthBar(scene, 0.0, -22.0))
    }

    update (time: number, delta: number)
    {
        this.hpBar.updatePos(this.x, this.y)
        this.hpBar.update(time, delta)
    }

    destroy (_fromScene?: boolean)
    {
        // this.hpBar.destroy(fromScene)
    }

    public takeDamage(damage: number)
    {
        this.health -= damage
        this.hpBar.draw(0.0, this.maxHealth, this.health)
        if (this.health <= 0)
        {
            this.emit('died', this.x, this.y, this.scraps)
            this.stopBody()
        }
    }

    public start(x: number, y: number, conf: RoboConf)
    {
        this.maxHealth = conf.health
        this.health = conf.health
        this.scraps = Phaser.Math.Between(conf.minScraps, conf.maxScraps)

        // this.setTexture(conf.texture)
        this.play(conf.anim)
        this.setFlipX(x > GAME_WIDTH * 0.5)

        this.hpBar.setActive(true)

        this.enableBody(undefined, undefined, undefined, true, true)

        this.setSize(conf.sizeX, conf.sizeY)

        let vec = new Phaser.Math.Vector2(GAME_WIDTH * 0.5, GAME_HEIGHT * 0.5)
        vec = vec.subtract(new Phaser.Math.Vector2(x, y))
        vec = vec.normalize()
        this.setVelocity(vec.x * conf.speed, vec.y * conf.speed)
    }

    public stopBody()
    {
        this.disableBody(true, true)
        this.hpBar.setActive(false)
        this.hpBar.setVisible(false)
        this.removeAllListeners('died')
    }
}
