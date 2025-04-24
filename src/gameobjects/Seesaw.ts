import { Input } from 'phaser'
import { GAME_HEIGHT, GAME_WIDTH, Projectiles, Turrets } from '../constants/GameConst'
import Turret from './turrets/Turret'
import SmallGun from './turrets/SmallGun'
import GatlingGun from './turrets/GatlingGun'
import HeartContainer from './user-interfaces/HeartContainer'

export default class Seesaw extends Phaser.Physics.Arcade.Sprite
{
    public health: number = 3

    // public friction: number = 0.8
    // public maxRotationVelocity: number = 0.3

    public turretLeft: Turret
    public turretRight: Turret

    public turretLeftOffsetX: number = -85
    public turretRightOffsetX: number = 85

    private leftTurretRounds: number = 0
    private rightTurretRounds: number = 0

    private leftKeys: Input.Keyboard.Key[]
    private rightKeys: Input.Keyboard.Key[]

    // private rotationVelocity: number = 0.0

    private turretBase: Phaser.GameObjects.Container
    private heartContainer: HeartContainer

    constructor (scene: Phaser.Scene)
    {
        super(scene, GAME_WIDTH * 0.5, GAME_HEIGHT * 0.5, 'seesaw_base')
        
        scene.add.existing(this)
        scene.physics.add.existing(this)

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
            console.error('NO KEYBOARD')
        }

        this.setSize(120, 120)

        this.turretBase = scene.add.existing(this.addTurretBase(scene))
        // this.add(this.turretBase)
        this.turretLeft = scene.add.existing(new SmallGun(scene, this.turretLeftOffsetX, -5))
        this.turretRight = scene.add.existing(new SmallGun(scene, this.turretRightOffsetX, -5))
        this.turretBase.add([ this.turretLeft, this.turretRight ])

        this.heartContainer = scene.add.existing(new HeartContainer(scene, GAME_WIDTH * 0.5, GAME_HEIGHT * 0.5 - 60))
        // this.add(this.heartContainer)

        this.turretLeft.on('fired', this.onTurretLeftFired, this)
        this.turretRight.on('fired', this.onTurretRightFired, this)
    }

    update(time: number, delta: number)
    {
        this.turretLeft.inputFire = this.leftKeys[0].isDown || this.leftKeys[1].isDown
        this.turretRight.inputFire = this.rightKeys[0].isDown || this.rightKeys[1].isDown

        this.turretLeft.update(time, delta)
        this.turretRight.update(time, delta)
        
        this.turretBase.setRotation(this.getBody().rotation)

        /*
        this.turretBase.rotation += this.rotationVelocity * delta * 0.01
        const frictionThreshold = 0.002
        if (this.rotationVelocity > frictionThreshold)
        {
            this.rotationVelocity -= this.friction * delta * 0.00001
            if (this.rotationVelocity <= frictionThreshold)
            {
                this.rotationVelocity = 0.0
            }
        }
        else if (this.rotationVelocity < -frictionThreshold)
        {
            this.rotationVelocity += this.friction * delta * 0.00001
            if (this.rotationVelocity >= -frictionThreshold)
            {
                this.rotationVelocity = 0.0
            }
        }
        else
        {
            this.rotationVelocity = 0.0
        }
        */
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
                this.leftTurretRounds = 100
                break
            default:
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
                this.leftTurretRounds = 100
                break
            default:
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
    }

    private addTurretBase(scene: Phaser.Scene)
    {
        const maxAlpha = 0.7
        const upAng = Math.PI * -0.5
        const offsetY = -220

        return scene.make.container({
            x: GAME_WIDTH * 0.5, y: GAME_HEIGHT * 0.5,
            children: [
                scene.add.image(0, 0, 'seesaw'),
                scene.add.image(this.turretLeftOffsetX, offsetY, 'laser').setRotation(upAng).setAlpha(maxAlpha, 0, maxAlpha, 0),
                scene.add.image(this.turretRightOffsetX, offsetY, 'laser').setRotation(upAng).setAlpha(maxAlpha, 0, maxAlpha, 0),
            ],
        })
    }

    private getBody(): Phaser.Physics.Arcade.Body
    {
        if (this.body)
        {
            return this.body as Phaser.Physics.Arcade.Body
        }
        throw new Error('see saw is not a bodi')
    }

    private onTurretLeftFired(projectile: Projectiles)
    {
        // this.rotationVelocity -= this.turretLeft.maxForce * 0.01
        // this.rotationVelocity = Math.max(this.rotationVelocity, -this.maxRotationVelocity)
        this.getBody().setAngularVelocity(this.getBody().angularVelocity - this.turretRight.maxForce * 0.1)
        const x = Math.cos(this.getBody().rotation) * this.turretLeftOffsetX + this.x
        const y = Math.sin(this.getBody().rotation) * this.turretLeftOffsetX + this.y
        if (this.leftTurretRounds > 0)
        {
            this.leftTurretRounds--
            if (this.leftTurretRounds <= 0)
            {
                this.setTurretLeft(Turrets.SMALL_GUN)
            }
        }
        this.emit('turret_left_fired', x, y, this.turretBase.rotation, this.getBody().angularVelocity, projectile)
    }

    private onTurretRightFired(projectile: Projectiles)
    {
        // this.rotationVelocity += this.turretRight.maxForce * 0.01
        // this.rotationVelocity = Math.min(this.rotationVelocity, this.maxRotationVelocity)
        this.getBody().setAngularVelocity(this.getBody().angularVelocity + this.turretRight.maxForce * 0.1)
        const x = Math.cos(this.getBody().rotation) * this.turretRightOffsetX + this.x
        const y = Math.sin(this.getBody().rotation) * this.turretRightOffsetX + this.y
        if (this.rightTurretRounds > 0)
        {
            this.rightTurretRounds--
            if (this.rightTurretRounds <= 0)
            {
                this.setTurretRight(Turrets.SMALL_GUN)
            }
        }
        this.emit('turret_right_fired', x, y, this.turretBase.rotation, this.getBody().angularVelocity, projectile)
    }
}
