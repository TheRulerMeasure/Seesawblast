import { GAME_HEIGHT, GAME_WIDTH } from "../../constants/GameConst"
import HealthBar from "../user-interfaces/HealthBar"

export default class WeaponCrate extends Phaser.Physics.Arcade.Image
{
    public maxHealth: number = 250
    public health: number = 250

    private hpBar: HealthBar

    constructor (scene: Phaser.Scene)
    {
        super(scene, 0, 0, 'weapon_crate')

        this.hpBar = scene.add.existing(new HealthBar(scene, 0.0, -48, 86))
    }

    update(time: number, delta: number)
    {
        if (this.x < -50 || this.x > GAME_WIDTH + 50)
        {
            this.stop()
        }
        else if (this.y < -50 || this.y > GAME_HEIGHT + 50)
        {
            this.stop()
        }
        this.hpBar.update(time, delta)
        this.hpBar.updatePos(this.x, this.y)
    }

    public takeDamage(damage: number)
    {
        this.health -= damage
        this.hpBar.draw(0.0, this.maxHealth, this.health)
        if (this.health <= 0)
        {
            this.emit('died')
            this.stop()
        }
    }

    public start(x: number, y: number, velX: number, velY: number, health: number = 250)
    {
        this.health = this.maxHealth = health

        this.enableBody(true, x, y, true, true)

        this.hpBar.setActive(true)

        this.setVelocity(velX, velY)
    }

    public stop()
    {
        this.hpBar.setActive(false)
        this.hpBar.setVisible(false)
        this.disableBody(true, true)
        this.removeAllListeners('died')
    }
}
