import { Scene } from 'phaser'
import Seesaw from '../gameobjects/Seesaw'
import { GAME_HEIGHT, GAME_WIDTH, Projectiles } from '../constants/GameConst'
import Bullet from '../gameobjects/projectiles/Bullet'
import Robo from '../gameobjects/mobs/Robo'

export default class MainGame extends Scene
{
    private seesaw: Seesaw

    private bulletGroup: Phaser.Physics.Arcade.Group
    private roboGroup: Phaser.Physics.Arcade.Group
    private explosionGroup: Phaser.GameObjects.Group

    private readonly maxRoboSpawnDelay: number = 2000.0

    private roboSpawnDelay: number = 0.0

    private spawnRectInner: Phaser.Geom.Rectangle
    private spawnRectOuter: Phaser.Geom.Rectangle

    public constructor ()
    {
        super({ key: 'MainGame', active: false })
    }

    create ()
    {
        this.spawnRectInner = new Phaser.Geom.Rectangle(-10, -10, GAME_WIDTH + 20, GAME_HEIGHT + 20)
        this.spawnRectOuter = new Phaser.Geom.Rectangle(-50, -50, GAME_WIDTH + 100, GAME_HEIGHT + 100)

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

        this.explosionGroup = this.add.group({
            classType: Phaser.GameObjects.Sprite,
            defaultKey: 'small_explosion',
            maxSize: 50,
        })

        this.seesaw = this.add.existing(new Seesaw(this))
        this.seesaw.setDepth(20)

        this.seesaw.on('turret_left_fired', this.onSeesawTurretLeftFired, this)
        this.seesaw.on('turret_right_fired', this.onSeesawTurretRightFired, this)

        this.physics.add.overlap(this.bulletGroup, this.roboGroup, this.onBulletOverlapRobo, undefined, this)
        this.physics.add.overlap(this.roboGroup, this.seesaw, this.onSeesawOverlapEnemy, undefined, this)
    }

    update (time: number, delta: number)
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

    private putRoboAt (x: number, y: number)
    {
        const robo: Robo = this.roboGroup.get()
        if (robo)
        {
            robo.start(x, y)
            robo.once('died', this.onRoboDied, this)
        }
    }

    private putMuzzleFlashAt (x: number, y: number, rotation: number)
    {
        const muzzleFlash: Phaser.GameObjects.Sprite = this.explosionGroup.get(x, y, 'muzzle_flash')
        if (muzzleFlash)
        {
            muzzleFlash.setRotation(rotation)
            muzzleFlash.setDepth(100)
            muzzleFlash.setActive(true)
            muzzleFlash.setVisible(true)
            muzzleFlash.once(Phaser.Animations.Events.ANIMATION_COMPLETE, function () {
                muzzleFlash.setActive(false)
                muzzleFlash.setVisible(false)
            }, muzzleFlash)
            muzzleFlash.play('muzzle_flash_flash')
        }
    }

    private putExplosionAt (x: number, y: number, big: boolean = false)
    {
        const explosion: Phaser.GameObjects.Sprite = this.explosionGroup.get(x, y, big ? 'explosion' : 'small_explosion')
        if (explosion)
        {
            explosion.setRotation(0)
            explosion.setDepth(120)
            explosion.setActive(true)
            explosion.setVisible(true)
            explosion.once(Phaser.Animations.Events.ANIMATION_COMPLETE, function () {
                explosion.setActive(false)
                explosion.setVisible(false)
            }, explosion)
            explosion.play(big ? 'explosion_explode' : 'small_explosion_explode')
        }
    }

    private onSeesawTurretLeftFired (x: number, y: number, rotation: number, rotVel: number, projectile: Projectiles)
    {
        const rotationUp = rotation - Math.PI * 0.5
        const bullet: Bullet = this.bulletGroup.get()
        if (bullet)
        {
            let addVel = Math.max(rotVel, 0.0)
            addVel *= 1000.0
            const textureKeys = ['bullet', 'small_bullet']
            bullet.launch(x, y, rotationUp, addVel, textureKeys[projectile])
        }
        const muzzleX = x + Math.cos(rotationUp) * 34
        const muzzleY = y + Math.sin(rotationUp) * 34
        this.putMuzzleFlashAt(muzzleX, muzzleY, rotationUp)
    }

    private onSeesawTurretRightFired (x: number, y: number, rotation: number, rotVel: number, projectile: Projectiles)
    {
        const rotationUp = rotation - Math.PI * 0.5
        const bullet = this.bulletGroup.get() as Bullet
        if (bullet)
        {
            let addVel = Math.min(rotVel, 0.0) * -1.0
            addVel *= 1000.0
            const textureKeys = ['bullet', 'small_bullet']
            bullet.launch(x, y, rotationUp, addVel, textureKeys[projectile])
        }
        const muzzleX = x + Math.cos(rotationUp) * 34
        const muzzleY = y + Math.sin(rotationUp) * 34
        this.putMuzzleFlashAt(muzzleX, muzzleY, rotationUp)
    }

    private onBulletOverlapRobo (bullet: any, robo: any)
    {
        const b: Bullet = bullet
        this.putExplosionAt(b.x, b.y)
        b.disableBody(true, true)

        const r: Robo = robo
        r.takeDamage(b.damage)
    }

    private onSeesawOverlapEnemy (_seesaw: any, enemy: any)
    {
        const robo: Robo = enemy
        robo.removeAllListeners('died')
        robo.disableBody(true, true)
    }

    private onRoboDied (x: number, y: number)
    {
        this.putExplosionAt(x, y, true)
    }
}
