import { Scene } from 'phaser'
import Seesaw from '../gameobjects/Seesaw'
import { Projectiles } from '../constants/GameConst'
import Bullet from '../gameobjects/projectiles/Bullet'

export class Game extends Scene
{
    private seesaw: Seesaw

    private bulletGroup: Phaser.Physics.Arcade.Group

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
        this.bulletGroup = this.physics.add.group({
            classType: Bullet,
            defaultKey: 'bullet',
            maxSize: 100,
            runChildUpdate: true,
        })

        this.seesaw = this.add.existing(new Seesaw(this))
        this.seesaw.setDepth(10)

        this.seesaw.on('turret_left_fired', this.onSeesawTurretLeftFired, this)
        this.seesaw.on('turret_right_fired', this.onSeesawTurretRightFired, this)
    }

    update(time: number, delta: number)
    {
        this.seesaw.update(time, delta)
    }

    private onSeesawTurretLeftFired(x: number, y: number, rotation: number, rotVel: number, _projectile: Projectiles)
    {
        const bullet = this.bulletGroup.get() as Bullet
        if (bullet)
        {
            const r = rotation - Math.PI * 0.5
            let addVel = Math.max(rotVel, 0.0)
            addVel *= 1000.0
            bullet.launch(x, y, r, addVel)
        }
    }

    private onSeesawTurretRightFired(x: number, y: number, rotation: number, rotVel: number, _projectile: Projectiles)
    {
        const bullet = this.bulletGroup.get() as Bullet
        if (bullet)
        {
            const r = rotation - Math.PI * 0.5
            let addVel = Math.min(rotVel, 0.0) * -1.0
            addVel *= 1000.0
            bullet.launch(x, y, r, addVel)
        }
    }
}
