
const MAX_IMAGES_COUNT = 3

export default class HeartContainer extends Phaser.GameObjects.Container
{
    private images: Phaser.GameObjects.Image[]

    constructor (scene: Phaser.Scene, x: number, y: number)
    {
        super(scene, x, y)
        this.images = [
            scene.add.image(-32, 0, 'heart', 0),
            scene.add.image(0, 0, 'heart', 0),
            scene.add.image(32, 0, 'heart', 0),
        ]
        this.add(this.images)
    }

    public setHealthPoint(health: number)
    {
        for (let i = 0; i < MAX_IMAGES_COUNT; i++)
        {
            this.images[i].setFrame(1)
        }
        for (let i = 0; i < MAX_IMAGES_COUNT; i++)
        {
            if (i > health - 1)
            {
                break
            }
            this.images[i].setFrame(0)
        }
    }
}
