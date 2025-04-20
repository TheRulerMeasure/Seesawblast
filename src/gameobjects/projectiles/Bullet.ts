import { GAME_HEIGHT, GAME_WIDTH } from '../../constants/GameConst'

export default class Bullet extends Phaser.Physics.Arcade.Image
{
    public damage: number = 15

    update(_time: number, _delta: number)
    {
        if (this.x < 0 || this.x > GAME_WIDTH)
        {
            this.disableBody(true, true)
        }
        else if (this.y < 0 || this.y > GAME_HEIGHT)
        {
            this.disableBody(true, true)
        }
    }

    public launch(x: number, y: number, rotation: number, additionSpeed: number, texture: string = 'bullet')
    {
        this.setSize(8, 8)
        this.setRotation(rotation)

        this.setTexture(texture)

        this.enableBody(true, x, y, true, true)

        const speed = 660.0 + additionSpeed
        this.setVelocity(Math.cos(rotation) * speed, Math.sin(rotation) * speed)
    }
}
