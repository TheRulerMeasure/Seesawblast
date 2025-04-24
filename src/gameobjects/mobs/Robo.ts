import { GAME_HEIGHT, GAME_WIDTH, HEALTH_BAR_DEPTH } from '../../constants/GameConst'
import RoboConf from './RoboConf'

const HEALTH_BAR_WIDTH = 32
const HEALTH_BAR_HEIGHT = 8
const HEALTH_BAR_OFFSET_Y = -32

export default class Robo extends Phaser.Physics.Arcade.Sprite
{
    public maxHealth: number = 75
    public health: number = 75

    public scraps: number = 2

    private hpBar: Phaser.GameObjects.Graphics

    constructor (scene: Phaser.Scene)
    {
        super(scene, 0, 0, 'robo')
        
        this.hpBar = scene.add.graphics()
        this.hpBar.fillStyle(0xff0000, 1.0)
        this.hpBar.fillRect(HEALTH_BAR_WIDTH * -0.5, HEALTH_BAR_OFFSET_Y - HEALTH_BAR_HEIGHT * 0.5, HEALTH_BAR_WIDTH, HEALTH_BAR_HEIGHT)
        this.hpBar.setDepth(HEALTH_BAR_DEPTH)
    }

    update (_time: number, _delta: number)
    {
        this.hpBar.setPosition(this.x, this.y)
    }

    destroy (fromScene?: boolean)
    {
        // console.log(`robo destroyed from scene = ${fromScene}`)
        this.hpBar.destroy(fromScene)
    }

    public takeDamage(damage: number)
    {
        this.health -= damage
        let width = this.health / this.maxHealth
        width *= HEALTH_BAR_WIDTH
        width = Math.floor(width)
        this.hpBar.clear()
        this.hpBar.fillRect(HEALTH_BAR_WIDTH * -0.5, HEALTH_BAR_OFFSET_Y - HEALTH_BAR_HEIGHT * 0.5, width, HEALTH_BAR_HEIGHT)
        if (this.health <= 0)
        {
            this.emit('died', this.x, this.y, this.scraps)
            this.stopBody()
        }
    }

    public start(x: number, y: number, health: number = 75, conf: RoboConf = new RoboConf())
    {
        this.setSize(conf.sizeX, conf.sizeY)

        this.maxHealth = health
        this.health = health
        this.scraps = Phaser.Math.Between(conf.minScraps, conf.maxScraps)

        this.setTexture(conf.texture)
        this.play(conf.anim)
        this.setFlipX(x > GAME_WIDTH * 0.5)

        this.hpBar.setActive(true)
        this.hpBar.setVisible(true)

        this.enableBody(true, x, y, true, true)

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
