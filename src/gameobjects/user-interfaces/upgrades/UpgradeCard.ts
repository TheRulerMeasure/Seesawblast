import { GAME_HEIGHT, GAME_WIDTH, UPGRADE_CARD_DESC_DEPTH, UPGRADE_CARD_NAME_DEPTH, UPGRADE_CARD_PATCH_DEPTH } from "../../../constants/GameConst"
import UpgradeCardConf from "./UpgradeCardConf"

const CARD_WIDTH = 300
const CARD_HEIGHT = 560
const CARD_CORNER_SIZE = 32

export default class UpgradeCard extends Phaser.GameObjects.NineSlice
{
    public cardIndex: number = 0
    
    private cardNameText: Phaser.GameObjects.BitmapText
    private cardDescriptionText: Phaser.GameObjects.BitmapText

    constructor (scene: Phaser.Scene, cardIndex: number)
    {
        const [ x, y ] = [ GAME_WIDTH * 0.5, GAME_HEIGHT + 500 ]
        super(scene, x, y, 'metal_patch', undefined, CARD_WIDTH, CARD_HEIGHT, CARD_CORNER_SIZE, CARD_CORNER_SIZE, CARD_CORNER_SIZE, CARD_CORNER_SIZE)

        this.setDepth(UPGRADE_CARD_PATCH_DEPTH)

        this.cardIndex = Math.floor(cardIndex)

        this.cardNameText = scene.add.bitmapText(x, y - CARD_HEIGHT * 0.5 + 36, 'mini_font', 'Name Name')
        this.cardNameText.setOrigin(0.5, 0.5)
        this.cardNameText.setDepth(UPGRADE_CARD_NAME_DEPTH)

        this.cardDescriptionText = scene.add.bitmapText(x - CARD_WIDTH * 0.45, y - CARD_HEIGHT * 0.15, 'mini_font', [ 'description', 'description' ])
        this.cardDescriptionText.setDepth(UPGRADE_CARD_DESC_DEPTH)

        this.on(Phaser.Input.Events.POINTER_DOWN, this.onPressed, this)
    }

    public start(tween: Phaser.Tweens.TweenManager, conf: UpgradeCardConf)
    {
        this.cardNameText.setText(conf.name)
        this.cardDescriptionText.setText(conf.descriptions)

        this.setPosition(GAME_WIDTH * 0.5, GAME_HEIGHT + 500)
        this.setScale(0.5)
        this.setVisible(true)
        this.cardNameText.setVisible(true)
        this.cardDescriptionText.setVisible(true)

        const modIndex = this.cardIndex % 3
        const centerX = GAME_WIDTH * 0.5
        const targetX = modIndex == 0 ? centerX - CARD_WIDTH : modIndex == 1 ? centerX : centerX + CARD_WIDTH
        const targetY = GAME_HEIGHT * 0.5

        const chain = tween.chain({
            targets: this,
            persist: false,
            paused: false,
            tweens: [
                {
                    x: GAME_WIDTH * 0.5,
                    y: GAME_HEIGHT * 0.3,
                    scale: 1.0,
                    ease: 'linear',
                    duration: 250 + this.cardIndex * 250,
                },
                {
                    x: { value: targetX, duration: 650, ease: 'cubic.out' },
                    y: { value: targetY, duration: 800, ease: 'bounce.out' },
                },
            ],
        })
        chain.once(Phaser.Tweens.Events.TWEEN_COMPLETE, this.onTweenDone, this)
    }

    public stop()
    {
        const [ x, y ] = [ GAME_WIDTH * 0.5, GAME_HEIGHT + 500 ]
        this.setPosition(x, y)
        this.cardNameText.setPosition(x, y - CARD_HEIGHT * 0.5 + 36)
        this.cardDescriptionText.setPosition(x - CARD_WIDTH * 0.45, y - CARD_HEIGHT * 0.15)

        this.removeInteractive()
        this.setVisible(false)
        this.cardNameText.setVisible(false)
        this.cardDescriptionText.setVisible(false)
    }

    private onTweenDone()
    {
        this.cardNameText.setPosition(this.x, this.y - CARD_HEIGHT * 0.5 + 36)
        this.cardDescriptionText.setPosition(this.x - CARD_WIDTH * 0.45, this.y - CARD_HEIGHT * 0.15)
        this.setInteractive()
    }

    private onPressed()
    {
        this.emit('upgrade_selected', this.cardIndex)
    }
}
