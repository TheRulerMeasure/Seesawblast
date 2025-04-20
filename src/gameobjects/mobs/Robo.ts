import { GAME_HEIGHT, GAME_WIDTH } from '../../constants/GameConst'

export default class Robo extends Phaser.Physics.Arcade.Sprite
{
    public start(x: number, y: number, speed: number = 20.0)
    {
        this.enableBody(true, x, y, true, true)
        let vec = new Phaser.Math.Vector2(GAME_WIDTH * 0.5, GAME_HEIGHT * 0.5)
        vec = vec.subtract(new Phaser.Math.Vector2(x, y))
        vec = vec.normalize()
        this.setVelocity(vec.x * speed, vec.y * speed)
    }
}
