import { Scene } from 'phaser'
import Seesaw from '../gameobjects/Seesaw'

export class Game extends Scene
{
    private seesaw: Seesaw

    private bullet: Phaser.GameObjects.Image

    constructor ()
    {
        super('Game')
    }

    preload ()
    {
        this.load.image('seesaw', 'assets/seesaw.png')
        this.load.image('small_gun', 'assets/small_gun.png')
        this.load.image('bullet', 'assets/bullet.png')
    }

    create ()
    {
        this.bullet = this.add.image(0, 0, 'bullet')
        this.seesaw = this.add.existing(new Seesaw(this))
        this.seesaw.on('turret_left_fired', this.onSeesawTurretLeftFired, this)
        this.seesaw.on('turret_right_fired', this.onSeesawTurretRightFired, this)
    }

    update(time: number, delta: number)
    {
        this.seesaw.update(time, delta)
    }

    private onSeesawTurretLeftFired(x: number, y: number)
    {
        this.bullet.setPosition(x, y)
    }

    private onSeesawTurretRightFired(x: number, y: number)
    {
        this.bullet.setPosition(x, y)
    }
}
