import { GAME_HEIGHT, GAME_WIDTH } from '../../constants/GameConst'

export default class Bullet extends Phaser.Physics.Arcade.Image
{
    constructor (scene: Phaser.Scene, x: number, y: number)
    {
        super(scene, x, y, 'bullet')
    }

    update(_time: number, _delta: number)
    {
        if (this.x < 0 || this.x > GAME_WIDTH)
        {
            this.setActive(false)
            this.setVisible(false)
        }
        else if (this.y < 0 || this.y > GAME_HEIGHT)
        {
            this.setActive(false)
            this.setVisible(false)
        }
    }

    public launch(x: number, y: number, rotation: number, additionSpeed: number)
    {
        this.setSize(8, 8)
        this.setPosition(x, y)
        this.setRotation(rotation)

        this.setActive(true)
        this.setVisible(true)

        const speed = 350.0 + additionSpeed
        this.setVelocity(Math.cos(rotation) * speed, Math.sin(rotation) * speed)
    }
}
