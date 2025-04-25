import { Scene } from 'phaser'
import Seesaw from '../gameobjects/Seesaw'
import { EXPLOSION_DEPTH, GAME_HEIGHT, GAME_WIDTH, MOB_DEPTH, PROJECTILE_DEPTH, Projectiles, SCRAP_DEPTH, Turrets, WEAPON_CRATE_DEPTH } from '../constants/GameConst'
import Bullet from '../gameobjects/projectiles/Bullet'
import Robo from '../gameobjects/mobs/Robo'
import LevelProgBar from '../gameobjects/user-interfaces/LevelProgBar'
import ScrapCollectable from '../gameobjects/effects/ScrapCollectable'
import RoboConf from '../gameobjects/mobs/RoboConf'
import GameStage from './GameStage'
import WeaponCrate from '../gameobjects/powerups/WeaponCrate'

export default class MainGame extends Scene
{
    private seesaw: Seesaw

    private bulletGroup: Phaser.Physics.Arcade.Group
    private roboGroup: Phaser.Physics.Arcade.Group
    private weaponCrateGroup: Phaser.Physics.Arcade.Group

    private explosionGroup: Phaser.GameObjects.Group

    private scrapGroup: Phaser.GameObjects.Group

    private levelProgBar: LevelProgBar

    private readonly maxRoboSpawnDelay: number = 2000.0
    private readonly maxWeaponCrateSpawnDelay: number = 24000.0

    private roboSpawnDelay: number = 0.0
    private roboSpawnCount: number = 0

    private weaponCrateSpawnDelay: number = 0.0

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

        this.roboGroup = this.physics.add.group({
            classType: Robo,
            defaultKey: 'robo',
            maxSize: 50,
            runChildUpdate: true,
        })

        this.weaponCrateGroup = this.physics.add.group({
            classType: WeaponCrate,
            maxSize: 10,
            runChildUpdate: true,
        })

        this.explosionGroup = this.add.group({
            classType: Phaser.GameObjects.Sprite,
            defaultKey: 'small_explosion',
            maxSize: 50,
        })

        this.scrapGroup = this.add.group({
            classType: ScrapCollectable,
            defaultKey: 'scrap',
            defaultFrame: 0,
            maxSize: 200,
        })
        
        this.seesaw = new Seesaw(this)

        this.levelProgBar = this.add.existing(new LevelProgBar(this))

        this.seesaw.on('turret_left_fired', this.onSeesawTurretLeftFired, this)
        this.seesaw.on('turret_right_fired', this.onSeesawTurretRightFired, this)

        this.levelProgBar.on('reached_next_level', this.onLevelProgReachedNextLevel, this)

        this.physics.add.overlap(this.bulletGroup, this.roboGroup, this.onBulletOverlapRobo, undefined, this)
        this.physics.add.overlap(this.bulletGroup, this.weaponCrateGroup, this.onBulletOverlapWeaponCrate, undefined, this)
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
            this.roboSpawnCount++
        }

        this.weaponCrateSpawnDelay += delta

        if (this.weaponCrateSpawnDelay >= this.maxWeaponCrateSpawnDelay)
        {
            this.putWeaponCrates()
            this.weaponCrateSpawnDelay = 0.0
        }

        this.levelProgBar.update(time, delta)
    }

    public updateLevelProgress()
    {
        this.levelProgBar.updateAndSetNextLevel(150)
    }

    public processUpgrade()
    {

    }

    public attachNewGunLeft()
    {
        this.seesaw.setTurretLeft(Turrets.GATLING_GUN)
    }

    public attachNewGunRight()
    {
        this.seesaw.setTurretRight(Turrets.GATLING_GUN)
    }

    private putWeaponCrates()
    {
        const topLeftBottomRight = Math.random() > 0.5
        if (topLeftBottomRight)
        {
            this.putWeaponCrateAt(GAME_WIDTH * 0.15, GAME_HEIGHT * 0.15)
            this.putWeaponCrateAt(GAME_WIDTH * 0.85, GAME_HEIGHT * 0.85)
        }
        else
        {
            this.putWeaponCrateAt(GAME_WIDTH * 0.85, GAME_HEIGHT * 0.15)
            this.putWeaponCrateAt(GAME_WIDTH * 0.15, GAME_HEIGHT * 0.85)
        }
    }

    private putWeaponCrateAt(x: number, y: number)
    {
        const weaponCrate: WeaponCrate = this.weaponCrateGroup.get()
        if (weaponCrate)
        {
            weaponCrate.setDepth(WEAPON_CRATE_DEPTH)
            const horizontalMovement = Math.random() > 0.5
            let velX = 0.0
            let velY = 0.0
            if (horizontalMovement)
            {
                velX = x > GAME_WIDTH * 0.5 ? -50 : 50
            }
            else
            {
                velY = y > GAME_HEIGHT * 0.5 ? -50 : 50
            }
            weaponCrate.start(x, y, velX, velY)
            weaponCrate.once('died', this.onWeaponCrateDied, this)
        }
    }

    private putRoboAt(x: number, y: number)
    {
        const health = 5
        const conf = new RoboConf()
        conf.texture = 'tank'
        conf.anim = 'tank_walk'
        conf.sizeX = 16
        conf.sizeY = 16
        conf.minScraps = 1
        conf.maxScraps = 2
        const robo: Robo = this.roboGroup.get(x, y, conf.texture)
        if (robo)
        {
            robo.setDepth(MOB_DEPTH)

            robo.start(x, y, health, conf)
            robo.once('died', this.onRoboDied, this)
        }
    }

    private putMuzzleFlashAt(x: number, y: number, rotation: number)
    {
        const muzzleFlash: Phaser.GameObjects.Sprite = this.explosionGroup.get(x, y, 'muzzle_flash')
        if (muzzleFlash)
        {
            muzzleFlash.setRotation(rotation)
            muzzleFlash.setDepth(EXPLOSION_DEPTH)
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
            explosion.setDepth(EXPLOSION_DEPTH)
            explosion.setActive(true)
            explosion.setVisible(true)
            explosion.once(Phaser.Animations.Events.ANIMATION_COMPLETE, function () {
                explosion.setActive(false)
                explosion.setVisible(false)
            }, explosion)
            explosion.play(big ? 'explosion_explode' : 'small_explosion_explode')
        }
    }

    private putScrapAt(x: number, y: number, amount: number)
    {
        const scrap: ScrapCollectable = this.scrapGroup.get()
        if (scrap)
        {
            scrap.setDepth(SCRAP_DEPTH)
            scrap.start(x, y, this.tweens, amount)
            scrap.once('get_collected', this.onScrapCollected, this)
        }
    }

    private onSeesawTurretLeftFired(x: number, y: number, rotation: number, rotVel: number, projectile: Projectiles)
    {
        const rotationUp = rotation - Math.PI * 0.5
        const bullet: Bullet = this.bulletGroup.get()
        if (bullet)
        {
            let addVel = Math.max(rotVel, 0.0)
            addVel *= 100.0
            const textureKeys = ['bullet', 'small_bullet']
            bullet.setDepth(PROJECTILE_DEPTH)
            bullet.launch(x, y, rotationUp, addVel, textureKeys[projectile])
        }
        const outRadius = 34
        const muzzleX = x + Math.cos(rotationUp) * outRadius
        const muzzleY = y + Math.sin(rotationUp) * outRadius
        this.putMuzzleFlashAt(muzzleX, muzzleY, rotationUp)
    }

    private onSeesawTurretRightFired(x: number, y: number, rotation: number, rotVel: number, projectile: Projectiles)
    {
        const rotationUp = rotation - Math.PI * 0.5
        const bullet = this.bulletGroup.get() as Bullet
        if (bullet)
        {
            let addVel = Math.min(rotVel, 0.0) * -1.0
            addVel *= 100.0
            const textureKeys = ['bullet', 'small_bullet']
            bullet.setDepth(PROJECTILE_DEPTH)
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

    private onBulletOverlapWeaponCrate(bullet: any, weaponCrate: any)
    {
        const b: Bullet = bullet
        this.putExplosionAt(b.x, b.y)
        b.disableBody(true, true)

        const wp: WeaponCrate = weaponCrate
        wp.takeDamage(b.damage)
    }

    private onSeesawOverlapEnemy(seesaw: any, enemy: any)
    {
        const robo: Robo = enemy
        robo.stopBody()
        const s: Seesaw = seesaw
        s.TakeDamage(1)
    }

    private onRoboDied(x: number, y: number, scraps: number)
    {
        if (scraps < 10)
        {
            let givenAmount = Phaser.Math.Between(1, 3)
            this.putScrapAt(x, y, Math.min(givenAmount, scraps))
            while (givenAmount < scraps)
            {
                this.putScrapAt(x, y, Math.min(givenAmount, scraps))
                givenAmount += Phaser.Math.Between(1, 3)
            }
        }
        else
        {
            let givenAmount = Phaser.Math.Between(4, 8)
            this.putScrapAt(x, y, Math.min(givenAmount, scraps))
            while (givenAmount < scraps)
            {
                this.putScrapAt(x, y, Math.min(givenAmount, scraps))
                givenAmount += Phaser.Math.Between(4, 8)
            }
        }
        this.putExplosionAt(x, y, true)
    }

    private onScrapCollected(amount: number)
    {
        this.levelProgBar.addProgress(amount)
    }

    private onWeaponCrateDied()
    {
        const gameStage = this.scene.get('GameStage') as GameStage
        gameStage.initSpecialTurret()
    }

    private onLevelProgReachedNextLevel()
    {
        const gameStage = this.scene.get('GameStage') as GameStage
        gameStage.initUpgrade()
    }
}
