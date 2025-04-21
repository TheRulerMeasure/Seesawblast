
export default class Explosion extends Phaser.GameObjects.Sprite
{
    private lifeTime: number = 0.0

    public override update(_time: number, delta: number)
    {
        this.lifeTime -= delta
        if (this.lifeTime <= 0)
        {
            this.setActive(false)
            this.setVisible(false)
        }
    }

    public start(x: number, y: number, rotation: number, texture: string, anim: Phaser.Animations.Animation)
    {
        this.setPosition(x, y)
        this.setRotation(rotation)
        this.setTexture(texture)

        this.lifeTime = anim.duration

        this.setActive(true)
        this.setVisible(true)

        this.play(anim)
    }
}
