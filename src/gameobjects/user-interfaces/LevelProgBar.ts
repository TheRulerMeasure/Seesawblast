import { GAME_HEIGHT, GAME_WIDTH, LVL_PROGBAR_OVER_DEPTH, LVL_PROGBAR_PROG_DEPTH } from "../../constants/GameConst";

export default class LevelProgBar extends Phaser.GameObjects.Image
{
    private scrap: Phaser.GameObjects.Image

    constructor (scene: Phaser.Scene)
    {
        const [ x, y ] = [ GAME_WIDTH * 0.5, GAME_HEIGHT * 0.05 ]
        super(scene, x, y, 'level_progbar_over')

        this.setDepth(LVL_PROGBAR_OVER_DEPTH)

        const progLayer = scene.add.layer()
        progLayer.setDepth(LVL_PROGBAR_PROG_DEPTH)
        const progUnder = scene.make.image({
            x,
            y,
            key: 'level_progbar_under',
        }, false)
        const mask = progUnder.createBitmapMask();
        progLayer.setMask(mask)
        this.scrap = progLayer.add(scene.make.sprite({ x, y, key: 'scrap_progress' }))
    }

    update (_time: number, delta: number)
    {
        const dt = delta * 0.01
        this.scrap.x -= 2 * dt
    }
}
