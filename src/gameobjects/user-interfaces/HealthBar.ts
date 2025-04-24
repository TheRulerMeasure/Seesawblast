import { HEALTH_BAR_DEPTH } from "../../constants/GameConst"

const BAR_HEIGHT = 4.0

export default class HealthBar extends Phaser.GameObjects.Graphics
{
    public offsetX: number = 0.0
    public offsetY: number = 0.0

    private maxWidth: number = 2.0

    private maxVisibleTime: number = 4500

    private visibleTime: number = 0.0

    constructor (scene: Phaser.Scene, offsetX: number = 0.0, offsetY: number = -20.0, maxWidth: number = 48.0, maxVisibleTime: number = 4500)
    {
        super(scene)

        this.offsetX = offsetX
        this.offsetY = offsetY
        
        this.maxWidth = Math.max(maxWidth, 2.0)
        this.maxVisibleTime = maxVisibleTime

        this.setDepth(HEALTH_BAR_DEPTH)
    }

    update(_time: number, delta: number)
    {
        if (this.visibleTime > 0)
        {
            this.visibleTime -= delta
            if (this.visibleTime <= 0)
            {
                this.setVisible(false)
            }
        }
    }

    public updatePos(x: number, y: number)
    {
        this.setPosition(x + this.offsetX, y + this.offsetY)
    }

    public draw(minValue: number, maxValue: number, value: number)
    {
        this.visibleTime = this.maxVisibleTime
        
        this.setVisible(true)

        const diff = Phaser.Math.Difference(maxValue, minValue)
        let width = (value - minValue) / diff
        width *= this.maxWidth
        width = Math.floor(Math.max(width, 2.0))
        
        this.clear()

        const outlineWidth = 3.0

        this.fillStyle(0x222222, 1)
        this.fillRect(this.maxWidth * -0.5 - outlineWidth, BAR_HEIGHT * -0.5 - outlineWidth, this.maxWidth + outlineWidth * 2.0, BAR_HEIGHT + outlineWidth * 2.0)

        this.fillStyle(0xdfdfdf, 1)
        this.fillRect(this.maxWidth * -0.5, BAR_HEIGHT * -0.5, this.maxWidth, BAR_HEIGHT)

        this.fillStyle(0xee2222, 1)
        this.fillRect(this.maxWidth * -0.5, BAR_HEIGHT * -0.5, width, BAR_HEIGHT)
    }
}
