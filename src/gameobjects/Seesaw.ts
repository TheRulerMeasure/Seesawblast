import { Input } from 'phaser'
import { GAME_HEIGHT, GAME_WIDTH } from '../constants/GameConst'
import Turret from './turrets/Turret'

export default class Seesaw extends Phaser.GameObjects.Container
{
    public turretLeft: Turret
    public turretRight: Turret

    public turretLeftOffsetX: number = -85
    public turretRightOffsetX: number = 85

    private leftKeys: Input.Keyboard.Key[]
    private rightKeys: Input.Keyboard.Key[]

    private rotationVelocity: number = 0.0

    private turretBase: Phaser.GameObjects.Container

    constructor (scene: Phaser.Scene)
    {
        super(scene, GAME_WIDTH * 0.5, GAME_HEIGHT * 0.5)

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
        scene.physics.world.enable(this, Phaser.Physics.Arcade.STATIC_BODY)

        this.turretBase = scene.add.existing(this.addTurretBase(scene))
        this.add(this.turretBase)
        this.turretLeft = scene.add.existing(new Turret(scene, this.turretLeftOffsetX, -5, 'small_gun'))
        this.turretRight = scene.add.existing(new Turret(scene, this.turretRightOffsetX, -5, 'small_gun'))
        this.turretBase.add([ this.turretLeft, this.turretRight ])

        this.turretLeft.on('fired', this.onTurretLeftFired, this)
        this.turretRight.on('fired', this.onTurretRightFired, this)
    }

    update(time: number, delta: number)
    {
        this.turretLeft.inputFire = this.leftKeys[0].isDown || this.leftKeys[1].isDown
        this.turretRight.inputFire = this.rightKeys[0].isDown || this.rightKeys[1].isDown
        this.turretLeft.update(time, delta)
        this.turretRight.update(time, delta)
        this.turretBase.rotation += this.rotationVelocity * delta * 0.01
    }

    private addTurretBase(scene: Phaser.Scene)
    {
        return scene.make.container({
            x: 0, y: 0,
            children: [
                scene.add.image(0, 0, 'seesaw'),
            ],
        })
    }

    private onTurretLeftFired()
    {
        this.rotationVelocity -= this.turretLeft.maxForce * 0.01
        const x = Math.cos(this.turretBase.rotation) * this.turretLeftOffsetX + this.x
        const y = Math.sin(this.turretBase.rotation) * this.turretLeftOffsetX + this.y
        this.emit('turret_left_fired', x, y)
    }

    private onTurretRightFired()
    {
        this.rotationVelocity += this.turretRight.maxForce * 0.01
        const x = Math.cos(this.turretBase.rotation) * this.turretRightOffsetX + this.x
        const y = Math.sin(this.turretBase.rotation) * this.turretRightOffsetX + this.y
        this.emit('turret_right_fired', x, y)
    }
}
