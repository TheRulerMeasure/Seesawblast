import { AMMO_BAR_DEPTH, AMMO_ICON_DEPTH } from "../../../constants/GameConst"

const BAR_OFFSET_X = 2
const BAR_OFFSET_Y = 2
const BAR_WIDTH = 6
const BAR_HEIGHT = 128

const BAR_BG_WIDTH = 10
const BAR_BG_HEIGHT = 132

export default class SpecialTurretAmmoBar extends Phaser.GameObjects.Image
{
    private graphics: Phaser.GameObjects.Graphics

    constructor (scene: Phaser.Scene, x: number, y: number)
    {
        super(scene, x, y, 'gatling_gun_icon')

        this.setDepth(AMMO_ICON_DEPTH)

        this.graphics = scene.add.graphics()
        this.graphics.setPosition(x, y)
        this.graphics.setDepth(AMMO_BAR_DEPTH)
    }

    public start()
    {
        this.setVisible(true)
        this.graphics.setVisible(true)
    }

    public stop()
    {
        this.setVisible(false)
        this.graphics.setVisible(false)
    }

    public draw(minVal: number, maxVal: number, val: number)
    {
        this.graphics.clear()

        this.graphics.fillStyle(0x121212, 1)
        this.graphics.fillRect(BAR_BG_WIDTH * -0.5, 0, BAR_BG_WIDTH, BAR_BG_HEIGHT)

        this.graphics.fillStyle(0xdfdfdf, 1)
        this.graphics.fillRect(BAR_BG_WIDTH * -0.5 + BAR_OFFSET_X, BAR_OFFSET_Y, BAR_WIDTH, BAR_HEIGHT)

        let height = (val - minVal) / Phaser.Math.Difference(maxVal, minVal)
        height *= BAR_HEIGHT
        height = Math.floor(Math.max(height, 2))

        this.graphics.fillStyle(0x1111d9, 1)
        this.graphics.fillRect(BAR_BG_WIDTH * -0.5 + BAR_OFFSET_X, BAR_OFFSET_Y, BAR_WIDTH, height)
    }
}
