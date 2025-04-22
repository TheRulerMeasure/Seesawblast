import { GAME_HEIGHT, GAME_WIDTH, LVL_PROGBAR_OVER_DEPTH, LVL_PROGBAR_PROG_DEPTH } from "../../constants/GameConst";

const PROG_POS_X1 = -270
const PROG_POS_X2 = 490

export default class LevelProgBar extends Phaser.GameObjects.Image
{
    private nextLevelProgress: number = 100
    private currentProgress: number = 0
    private prevLevelProgress: number = 0

    private tintTime: number = 0.0

    private scrap: Phaser.GameObjects.Image

    constructor (scene: Phaser.Scene)
    {
        const [ x, y ] = [ GAME_WIDTH * 0.5, GAME_HEIGHT * 0.03 ]
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
        this.scrap = progLayer.add(scene.make.sprite({ x: PROG_POS_X1, y, key: 'scrap_progress' }))

        scene.tweens.add({
            targets: this.scrap,
            
            persist: true,
        })
    }

    update (_time: number, delta: number)
    {
        if (this.tintTime > 0)
        {
            this.tintTime -= delta
            if (Math.cos(this.tintTime * 0.03) > 0)
            {
                this.scrap.setTintFill(0xaaaaaa)
            }
            else
            {
                this.scrap.clearTint()
            }
            if (this.tintTime <= 0)
            {
                this.scrap.clearTint()
            }
        }
    }

    public addProgress(amount: number)
    {
        this.tintTime = 500

        this.currentProgress += amount
        const prog = this.currentProgress - this.prevLevelProgress
        const maxProg = this.nextLevelProgress - this.prevLevelProgress
        const x = Phaser.Math.Interpolation.Linear([PROG_POS_X1, PROG_POS_X2], prog / maxProg)
        this.scrap.setX(x)
        if (this.currentProgress >= this.nextLevelProgress)
        {
            this.emit('reachedNextLevel')
        }
    }

    public updateAndSetNextLevel(nextLevelProgress: number)
    {
        this.prevLevelProgress = this.nextLevelProgress
        this.nextLevelProgress = nextLevelProgress
        if (this.currentProgress >= this.nextLevelProgress)
        {
            this.emit('reachedNextLevel')
        }
    }
}
