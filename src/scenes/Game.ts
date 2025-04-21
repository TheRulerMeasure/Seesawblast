import { Scene } from 'phaser'
import Seesaw from '../gameobjects/Seesaw'
import { GAME_HEIGHT, GAME_WIDTH, Projectiles } from '../constants/GameConst'
import Bullet from '../gameobjects/projectiles/Bullet'
import Robo from '../gameobjects/mobs/Robo'

export class Game extends Scene
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
        super('Game')
    }

    preload ()
    {
        this.load.image('seesaw', 'assets/seesaw.png')

        this.load.image('small_gun', 'assets/small_gun.png')
        this.load.image('gatling_gun', 'assets/gatling_gun.png')

        this.load.image('bullet', 'assets/bullet.png')
        this.load.image('small_bullet', 'assets/small_bullet.png')

        this.load.spritesheet('small_explosion', 'assets/small_explosion_sheet.png', { frameWidth: 24, frameHeight: 24 })
        this.load.spritesheet('explosion', 'assets/explosion_sheet.png', { frameWidth: 128, frameHeight: 128 })
        this.load.spritesheet('muzzle_flash', 'assets/muzzle_flash_sheet.png', { frameWidth: 32, frameHeight: 32 })

        this.load.spritesheet('robo', 'assets/robo_sheet.png', { frameWidth: 64, frameHeight: 64 })

        this.load.image('laser', 'assets/laser.png')
    }

    create ()
    {
        this.spawnRectInner = new Phaser.Geom.Rectangle(-10, -10, GAME_WIDTH + 20, GAME_HEIGHT + 20)
        this.spawnRectOuter = new Phaser.Geom.Rectangle(-50, -50, GAME_WIDTH + 100, GAME_HEIGHT + 100)

        this.anims.create({
            key: 'robo_walk',
            frames: this.anims.generateFrameNumbers('robo', { frames: [ 0, 1 ] }),
            frameRate: 8,
            repeat: -1,
        })

        this.createEffectAnims()

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

        const keyboard = this.input.keyboard
        if (keyboard)
        {
            keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.P).on(Phaser.Input.Keyboard.Events.UP, this.onPauseButtonReleased, this)
        }
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

    private createEffectAnims()
    {
        this.anims.create({
            key: 'small_explosion_explode',
            frames: this.anims.generateFrameNumbers('small_explosion', { frames: [ 0, 1, 2 ] }),
            duration: 250,
        })
        this.anims.create({
            key: 'explosion_explode',
            frames: this.anims.generateFrameNumbers('explosion', { frames: [ 0, 1, 2, 3, 4, 5 ] }),
            duration: 500,
        })
        this.anims.create({
            key: 'muzzle_flash_flash',
            frames: this.anims.generateFrameNumbers('muzzle_flash', { frames: [ 0, 1, 2 ] }),
            duration: 300,
        })
    }

    private putRoboAt(x: number, y: number)
    {
        const robo: Robo = this.roboGroup.get()
        if (robo)
        {
            robo.start(x, y)
            robo.once('died', this.onRoboDied, this)
        }
    }

    private putMuzzleFlashAt(x: number, y: number, rotation: number)
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

    private putExplosionAt(x: number, y: number, big: boolean = false)
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

    private onSeesawTurretLeftFired(x: number, y: number, rotation: number, rotVel: number, projectile: Projectiles)
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

    private onSeesawTurretRightFired(x: number, y: number, rotation: number, rotVel: number, projectile: Projectiles)
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

    private onBulletOverlapRobo(bullet: any, robo: any)
    {
        const b: Bullet = bullet
        this.putExplosionAt(b.x, b.y)
        b.disableBody(true, true)

        const r: Robo = robo
        r.takeDamage(b.damage)
    }

    private onSeesawOverlapEnemy(_seesaw: any, enemy: any)
    {
        const robo: Robo = enemy
        robo.removeAllListeners('died')
        robo.disableBody(true, true)
    }

    private onRoboDied(x: number, y: number)
    {
        this.putExplosionAt(x, y, true)
    }

    private onPauseButtonReleased()
    {
        if (this.scene.isPaused())
        {
            this.scene.resume()
        }
        else
        {
            this.scene.pause()
        }
    }
}
