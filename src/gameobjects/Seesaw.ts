import { Input } from 'phaser'
import { GAME_HEIGHT, GAME_WIDTH, HEALTH_POINT_DEPTH, Projectiles, SEESAW_BASE_DEPTH, SEESAW_DEPTH, Turrets, Upgrades } from '../constants/GameConst'
import Turret from './turrets/Turret'
import SmallGun from './turrets/SmallGun'
import GatlingGun from './turrets/GatlingGun'
import HeartContainer from './user-interfaces/HeartContainer'
import SpecialTurretAmmoBar from './user-interfaces/special-turrets/SpecialTurretAmmoBar'
import GrenadeLauncher from './turrets/GrenadeLauncher'

const COLLISION_SIZE = 120
const ROTATION_DRAG = 0.15
const MAX_ROTATION_VELOCITY = 3.5

const LEFT_AMMO_BAR_X = GAME_WIDTH * 0.06
const LEFT_AMMO_BAR_Y = GAME_HEIGHT * 0.5

const RIGHT_AMMO_BAR_X = GAME_WIDTH * 0.94
const RIGHT_AMMO_BAR_Y = GAME_HEIGHT * 0.5

const moveToward = (fromVal: number, toVal: number, delta: number): number =>
{
    const sign = Math.sign(toVal - fromVal)
    return sign >= 1 ? Math.min(fromVal + delta, toVal) : sign <= -1 ? Math.max(fromVal - delta, toVal) : toVal
}

export default class Seesaw extends Phaser.Physics.Arcade.Sprite
{
    public health: number = 3

    public turretLeftOffsetX: number = -85
    public turretRightOffsetX: number = 85

    private turretLeft: Turret
    private turretRight: Turret

    private leftTurretRounds: number = 0
    private leftTurretMaxRounds: number = 900

    private rightTurretRounds: number = 0
    private rightTurretMaxRounds: number = 900

    private leftTurretAmmoBar: SpecialTurretAmmoBar
    private rightTurretAmmoBar: SpecialTurretAmmoBar

    private leftKeys: Input.Keyboard.Key[]
    private rightKeys: Input.Keyboard.Key[]

    private turretRotation: number = 0.0
    private turretRotationVelocity: number = 0.0

    private turretBase: Phaser.GameObjects.Container
    private heartContainer: HeartContainer

    private lasers: Phaser.GameObjects.Image[]

    constructor (scene: Phaser.Scene)
    {
        super(scene, GAME_WIDTH * 0.5, GAME_HEIGHT * 0.5, 'seesaw_base')
        
        scene.add.existing(this)
        scene.physics.add.existing(this, true)

        // scene.add.

        this.setDepth(SEESAW_BASE_DEPTH)

        this.setSize(COLLISION_SIZE, COLLISION_SIZE)

        this.turretBase = scene.add.existing(this.addTurretBase(scene))
        this.turretBase.setDepth(SEESAW_DEPTH)

        this.turretLeft = scene.add.existing(new SmallGun(scene, this.turretLeftOffsetX, -5))
        this.turretRight = scene.add.existing(new SmallGun(scene, this.turretRightOffsetX, -5))
        this.turretBase.add([ this.turretLeft, this.turretRight ])

        this.leftTurretAmmoBar = scene.add.existing(new SpecialTurretAmmoBar(scene, LEFT_AMMO_BAR_X, LEFT_AMMO_BAR_Y))
        this.leftTurretAmmoBar.stop()
        this.rightTurretAmmoBar = scene.add.existing(new SpecialTurretAmmoBar(scene, RIGHT_AMMO_BAR_X, RIGHT_AMMO_BAR_Y))
        this.rightTurretAmmoBar.stop()

        this.heartContainer = scene.add.existing(new HeartContainer(scene, GAME_WIDTH * 0.5, GAME_HEIGHT * 0.5 - 5))
        this.heartContainer.setDepth(HEALTH_POINT_DEPTH)

        this.turretLeft.on('fired', this.onTurretLeftFired, this)
        this.turretRight.on('fired', this.onTurretRightFired, this)

        if (scene.input.keyboard)
        {
            this.leftKeys = [
                scene.input.keyboard.addKey(Input.Keyboard.KeyCodes.A),
                scene.input.keyboard.addKey(Input.Keyboard.KeyCodes.LEFT),
            ]
            this.rightKeys = [
                scene.input.keyboard.addKey(Input.Keyboard.KeyCodes.D),
                scene.input.keyboard.addKey(Input.Keyboard.KeyCodes.RIGHT),
            ]
        }
        else
        {
            throw new Error('NO KEYBOARD')
        }
    }

    update(time: number, delta: number)
    {
        this.turretLeft.inputFire = this.leftKeys[0].isDown || this.leftKeys[1].isDown
        this.turretRight.inputFire = this.rightKeys[0].isDown || this.rightKeys[1].isDown

        this.turretLeft.update(time, delta)
        this.turretRight.update(time, delta)

        this.turretRotation += this.turretRotationVelocity * delta * 0.001

        this.turretRotationVelocity = moveToward(this.turretRotationVelocity, 0, ROTATION_DRAG * delta * 0.001)

        this.turretBase.setRotation(this.turretRotation)
    }

    public processUpgrade(upgrade: Upgrades)
    {
        switch (upgrade)
        {
            case Upgrades.ENABLE_LASERS:
                for (let i = 0; i < this.lasers.length; i++)
                {
                    this.lasers[i].setVisible(true)
                }
                break
        }
    }

    public setTurretLeft(turretType: Turrets)
    {
        this.turretLeft.removeAllListeners('fired')
        this.turretLeft.destroy(true)
        const x = this.turretLeftOffsetX
        const y = -5
        let turret: Turret
        switch (turretType)
        {
            case Turrets.GATLING_GUN:
                turret = this.scene.add.existing(new GatlingGun(this.scene, x, y))
                this.leftTurretRounds = this.leftTurretMaxRounds = 250
                this.leftTurretAmmoBar.start()
                this.leftTurretAmmoBar.draw(0, this.leftTurretMaxRounds, this.leftTurretRounds)
                break
            case Turrets.GRENADE_LAUNCHER:
                turret = this.scene.add.existing(new GrenadeLauncher(this.scene, x, y))
                this.leftTurretRounds = this.leftTurretMaxRounds = 25
                this.leftTurretAmmoBar.start()
                this.leftTurretAmmoBar.draw(0, this.leftTurretMaxRounds, this.leftTurretRounds)
                break
            default:
                this.leftTurretAmmoBar.stop()
                turret = this.scene.add.existing(new SmallGun(this.scene, x, y))
                break
        }
        this.turretBase.add(turret)
        turret.on('fired', this.onTurretLeftFired, this)
        this.turretLeft = turret
    }

    public setTurretRight(turretType: Turrets)
    {
        this.turretRight.removeAllListeners('fired')
        this.turretRight.destroy(true)
        const x = this.turretRightOffsetX
        const y = -5
        let turret: Turret
        switch (turretType)
        {
            case Turrets.GATLING_GUN:
                turret = this.scene.add.existing(new GatlingGun(this.scene, x, y))
                this.rightTurretRounds = this.rightTurretMaxRounds = 250
                this.rightTurretAmmoBar.start()
                this.rightTurretAmmoBar.draw(0, this.rightTurretMaxRounds, this.rightTurretRounds)
                break
            case Turrets.GRENADE_LAUNCHER:
                turret = this.scene.add.existing(new GrenadeLauncher(this.scene, x, y))
                this.rightTurretRounds = this.rightTurretMaxRounds = 25
                this.rightTurretAmmoBar.start()
                this.rightTurretAmmoBar.draw(0, this.rightTurretMaxRounds, this.rightTurretRounds)
                break
            default:
                this.rightTurretAmmoBar.stop()
                turret = this.scene.add.existing(new SmallGun(this.scene, x, y))
                break
        }
        this.turretBase.add(turret)
        turret.on('fired', this.onTurretRightFired, this)
        this.turretRight = turret
    }

    public TakeDamage(damage: number)
    {
        this.health -= damage
        this.heartContainer.setHealthPoint(this.health)
        if (this.health <= 0)
        {
            this.emit('died')
        }
    }

    private addTurretBase(scene: Phaser.Scene)
    {
        const maxAlpha = 0.7
        const upAng = Math.PI * -0.5
        const offsetY = -220

        this.lasers = [
            scene.add.image(this.turretLeftOffsetX, offsetY, 'laser').setRotation(upAng).setAlpha(maxAlpha, 0, maxAlpha, 0),
            scene.add.image(this.turretRightOffsetX, offsetY, 'laser').setRotation(upAng).setAlpha(maxAlpha, 0, maxAlpha, 0),
        ]
        this.lasers[0].setVisible(false)
        this.lasers[1].setVisible(false)

        return scene.make.container({
            x: GAME_WIDTH * 0.5, y: GAME_HEIGHT * 0.5,
            children: [
                scene.add.image(0, 0, 'seesaw'),
                this.lasers[0],
                this.lasers[1],
            ],
        })
    }

    private onTurretLeftFired(projectile: Projectiles)
    {
        this.turretRotationVelocity -= this.turretLeft.maxForce * 0.1
        this.turretRotationVelocity = Math.max(this.turretRotationVelocity, -MAX_ROTATION_VELOCITY)
        const x = Math.cos(this.turretRotation) * this.turretLeftOffsetX + this.x
        const y = Math.sin(this.turretRotation) * this.turretLeftOffsetX + this.y
        if (this.leftTurretRounds > 0)
        {
            this.leftTurretRounds--
            if (this.leftTurretRounds <= 0)
            {
                this.setTurretLeft(Turrets.SMALL_GUN)
            }
            else
            {
                this.leftTurretAmmoBar.draw(0, this.leftTurretMaxRounds, this.leftTurretRounds)
            }
        }
        this.emit('turret_left_fired', x, y, this.turretBase.rotation, this.turretRotationVelocity, projectile)
    }

    private onTurretRightFired(projectile: Projectiles)
    {
        this.turretRotationVelocity += this.turretRight.maxForce * 0.1
        this.turretRotationVelocity = Math.min(this.turretRotationVelocity, MAX_ROTATION_VELOCITY)
        const x = Math.cos(this.turretRotation) * this.turretRightOffsetX + this.x
        const y = Math.sin(this.turretRotation) * this.turretRightOffsetX + this.y
        if (this.rightTurretRounds > 0)
        {
            this.rightTurretRounds--
            if (this.rightTurretRounds <= 0)
            {
                this.setTurretRight(Turrets.SMALL_GUN)
            }
            else
            {
                this.rightTurretAmmoBar.draw(0, this.rightTurretMaxRounds, this.rightTurretRounds)
            }
        }
        this.emit('turret_right_fired', x, y, this.turretBase.rotation, this.turretRotationVelocity, projectile)
    }
}
