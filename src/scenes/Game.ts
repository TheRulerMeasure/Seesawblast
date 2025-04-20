import { Scene } from 'phaser'
import Seesaw from '../gameobjects/Seesaw'
import { GAME_HEIGHT, GAME_WIDTH, Projectiles, Turrets } from '../constants/GameConst'
import Bullet from '../gameobjects/projectiles/Bullet'
import Robo from '../gameobjects/mobs/Robo'

export class Game extends Scene
{
    private seesaw: Seesaw

    private bulletGroup: Phaser.Physics.Arcade.Group
    private roboGroup: Phaser.Physics.Arcade.Group

    private readonly maxRoboSpawnDelay: number = 2000.0

    private roboSpawnDelay: number = 0.0

    private spawnRectInner: Phaser.Geom.Rectangle
    private spawnRectOuter: Phaser.Geom.Rectangle

    constructor ()
    {
        super('Game')
    }

    preload ()
    {
        this.load.image('seesaw', 'assets/seesaw.png')

        this.load.image('small_gun', 'assets/small_gun.png')
        this.load.image('gatling_gun', 'assets/gatling_gun.png')

        this.load.image('bullet', 'assets/bullet.png')
        this.load.image('small_bullet', 'assets/small_bullet.png')

        this.load.spritesheet('robo', 'assets/robo_sheet.png', {
            frameWidth: 64, frameHeight: 64,
        })

        this.load.image('laser', 'assets/laser.png')
    }

    create ()
    {
        this.spawnRectInner = new Phaser.Geom.Rectangle(-10, -10, GAME_WIDTH + 20, GAME_HEIGHT + 20)
        this.spawnRectOuter = new Phaser.Geom.Rectangle(-50, -50, GAME_WIDTH + 100, GAME_HEIGHT + 100)

        this.anims.create({
            key: 'walk',
            frames: this.anims.generateFrameNumbers('robo', { frames: [ 0, 1 ] }),
            frameRate: 8,
            repeat: -1,
        })

        this.bulletGroup = this.physics.add.group({
            classType: Bullet,
            defaultKey: 'bullet',
            maxSize: 100,
            runChildUpdate: true,
        })
        this.bulletGroup.setDepth(10)

        this.roboGroup = this.physics.add.group({
            classType: Robo,
            defaultKey: 'robo',
            maxSize: 50,
        })
        this.roboGroup.setDepth(1)

        this.seesaw = this.add.existing(new Seesaw(this))
        this.seesaw.setDepth(20)

        this.seesaw.on('turret_left_fired', this.onSeesawTurretLeftFired, this)
        this.seesaw.on('turret_right_fired', this.onSeesawTurretRightFired, this)

        this.physics.add.overlap(this.bulletGroup, this.roboGroup, this.onBulletOverlapRobo, undefined, this)
        this.physics.add.overlap(this.roboGroup, this.seesaw, this.onSeesawOverlapEnemy, undefined, this)
    }

    update(time: number, delta: number)
    {
        this.seesaw.update(time, delta)
        this.roboSpawnDelay += delta
        if (this.roboSpawnDelay >= this.maxRoboSpawnDelay)
        {
            const point = Phaser.Geom.Rectangle.RandomOutside(this.spawnRectOuter, this.spawnRectInner)
            this.putRoboAt(point.x, point.y)
            this.roboSpawnDelay = 0.0
        }
    }

    private putRoboAt(x: number, y: number)
    {
        const robo: Robo = this.roboGroup.get()
        if (robo)
        {
            robo.start(x, y)
            robo.play('walk')
        }
    }

    private onSeesawTurretLeftFired(x: number, y: number, rotation: number, rotVel: number, projectile: Projectiles)
    {
        const bullet: Bullet = this.bulletGroup.get()
        if (bullet)
        {
            const r = rotation - Math.PI * 0.5
            let addVel = Math.max(rotVel, 0.0)
            addVel *= 1000.0
            const textureKeys = ['bullet', 'small_bullet']
            bullet.launch(x, y, r, addVel, textureKeys[projectile])
        }
    }

    private onSeesawTurretRightFired(x: number, y: number, rotation: number, rotVel: number, projectile: Projectiles)
    {
        const bullet = this.bulletGroup.get() as Bullet
        if (bullet)
        {
            const r = rotation - Math.PI * 0.5
            let addVel = Math.min(rotVel, 0.0) * -1.0
            addVel *= 1000.0
            const textureKeys = ['bullet', 'small_bullet']
            bullet.launch(x, y, r, addVel, textureKeys[projectile])
        }
    }

    private onBulletOverlapRobo(bullet: any, robo: any)
    {
        const b: Bullet = bullet
        b.disableBody(true, true)

        const r: Robo = robo
        r.takeDamage(b.damage)
    }

    private onSeesawOverlapEnemy(_seesaw: any, enemy: any)
    {
        (enemy as Robo).disableBody(true, true)
    }
}
