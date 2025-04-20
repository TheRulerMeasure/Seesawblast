import { GAME_HEIGHT, GAME_WIDTH } from '../../constants/GameConst'

export default class Robo extends Phaser.Physics.Arcade.Sprite
{
    public health: number = 75

    public takeDamage(damage: number)
    {
        this.health -= damage
        if (this.health <= 0)
        {
            this.disableBody(true, true)
        }
    }

    public start(x: number, y: number, speed: number = 20.0, health: number = 75)
    {
        this.health = health
        this.setFlipX(x > GAME_WIDTH * 0.5)
        this.enableBody(true, x, y, true, true)
        let vec = new Phaser.Math.Vector2(GAME_WIDTH * 0.5, GAME_HEIGHT * 0.5)
        vec = vec.subtract(new Phaser.Math.Vector2(x, y))
        vec = vec.normalize()
        this.setVelocity(vec.x * speed, vec.y * speed)
    }
}
