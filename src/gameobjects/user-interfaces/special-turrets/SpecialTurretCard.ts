import { GAME_HEIGHT, GAME_WIDTH, NEW_TURRET_LABEL_DEPTH, SP_TURRET_CARD_BUTTON_DEPTH, SP_TURRET_CARD_BUTTON_TEXT_DEPTH, SPECIAL_TURRET_CARD_DEPTH, SPECIAL_TURRET_ICON_DEPTH } from "../../../constants/GameConst"

const CARD_WIDTH = 200
const CARD_HEIGHT = 200
const CARD_CORNER_SIZE = 32

const BUTTON_WIDTH = 200
const BUTTON_HEIGHT = 128

const addNineSlice = (scene: Phaser.Scene, x: number, y: number, width: number, height: number): Phaser.GameObjects.NineSlice => {
    return scene.add.nineslice(x, y, 'metal_patch', undefined, width, height, CARD_CORNER_SIZE, CARD_CORNER_SIZE, CARD_CORNER_SIZE, CARD_CORNER_SIZE)
}

export default class SpecialTurretCard extends Phaser.GameObjects.NineSlice
{
    private newTurretLabel: Phaser.GameObjects.BitmapText

    private tween: Phaser.Tweens.Tween
    private newTurretLabelTween: Phaser.Tweens.Tween
    private buttonTween: Phaser.Tweens.Tween

    private icon: Phaser.GameObjects.Image

    private buttonLeft: Phaser.GameObjects.NineSlice
    private buttonRight: Phaser.GameObjects.NineSlice

    private buttonLabelLeft: Phaser.GameObjects.BitmapText
    private buttonLabelRight: Phaser.GameObjects.BitmapText

    constructor (scene: Phaser.Scene)
    {
        const [ x, y ] = [ GAME_WIDTH * 0.5, GAME_HEIGHT * 0.5 + GAME_HEIGHT ]
        super(scene, x, y, 'metal_patch', undefined, CARD_WIDTH, CARD_HEIGHT, CARD_CORNER_SIZE, CARD_CORNER_SIZE, CARD_CORNER_SIZE, CARD_CORNER_SIZE)

        this.setDepth(SPECIAL_TURRET_CARD_DEPTH)

        this.newTurretLabel = scene.add.bitmapText(x, y, 'mini_font', 'Accquired a New Gun!')
        this.newTurretLabel.setDepth(NEW_TURRET_LABEL_DEPTH)
        this.newTurretLabel.setOrigin(0.5, 0.5)

        this.newTurretLabelTween = scene.tweens.add({
            targets: this.newTurretLabel,
            persist: true,
            paused: true,
            loop: 0,
            duration: 750,
            ease: 'quart.out',
            y: GAME_HEIGHT * 0.3
        })

        this.icon = scene.add.image(x, y, 'gatling_gun_icon')
        this.icon.setDepth(SPECIAL_TURRET_ICON_DEPTH)

        this.tween = scene.tweens.add({
            targets: [ this, this.icon ],
            persist: true,
            paused: true,
            loop: 0,
            duration: 2000,
            ease: 'quart.out',
            y: GAME_HEIGHT * 0.5,
        })

        this.buttonLeft = addNineSlice(scene, x - BUTTON_WIDTH, y, BUTTON_WIDTH, BUTTON_HEIGHT)
        this.buttonLeft.setDepth(SP_TURRET_CARD_BUTTON_DEPTH)
        this.buttonLeft.on(Phaser.Input.Events.POINTER_DOWN, this.onLeftButtonPressed, this)

        this.buttonRight = addNineSlice(scene, x + BUTTON_WIDTH, y, BUTTON_WIDTH, BUTTON_HEIGHT)
        this.buttonRight.setDepth(SP_TURRET_CARD_BUTTON_DEPTH)
        this.buttonRight.on(Phaser.Input.Events.POINTER_DOWN, this.onRightButtonPressed, this)

        this.buttonLabelLeft = scene.add.bitmapText(x - BUTTON_WIDTH, y, 'mini_font', [ 'Attach to', 'Left Side' ])
        this.buttonLabelLeft.setDepth(SP_TURRET_CARD_BUTTON_TEXT_DEPTH)
        this.buttonLabelLeft.setOrigin(0.5, 0.5)

        this.buttonLabelRight = scene.add.bitmapText(x + BUTTON_WIDTH, y, 'mini_font', [ 'Attach to', 'Right Side' ])
        this.buttonLabelRight.setDepth(SP_TURRET_CARD_BUTTON_TEXT_DEPTH)
        this.buttonLabelRight.setOrigin(0.5, 0.5)

        this.buttonTween = scene.tweens.add({
            targets: [ this.buttonLeft, this.buttonRight, this.buttonLabelLeft, this.buttonLabelRight ],
            persist: true,
            paused: true,
            loop: 0,
            duration: 1000,
            delay: 1000,
            ease: 'quart.out',
            y: GAME_HEIGHT * 0.8,
        })
        this.tween.on(Phaser.Tweens.Events.TWEEN_COMPLETE, this.onButtonTweenDone, this)
    }

    public start()
    {
        const [ x, y ] = [ GAME_WIDTH * 0.5, GAME_HEIGHT * 0.5 + GAME_HEIGHT ]

        this.setPosition(x, y)
        this.setActive(true)
        this.setVisible(true)

        this.icon.setPosition(x, y)
        this.icon.setActive(true)
        this.icon.setVisible(true)

        this.newTurretLabel.setPosition(x, y)
        this.newTurretLabel.setVisible(true)

        this.buttonLeft.setPosition(x - BUTTON_WIDTH, y)
        this.buttonLeft.setVisible(true)
        this.buttonLabelLeft.setPosition(x - BUTTON_WIDTH, y)
        this.buttonLabelLeft.setVisible(true)

        this.buttonRight.setPosition(x + BUTTON_WIDTH, y)
        this.buttonRight.setVisible(true)
        this.buttonLabelRight.setPosition(x + BUTTON_WIDTH, y)
        this.buttonLabelRight.setVisible(true)

        this.newTurretLabelTween.play()
        this.tween.play()
        this.buttonTween.play()
    }

    public stop()
    {
        this.setActive(false)
        this.setVisible(false)

        this.icon.setActive(false)
        this.icon.setVisible(false)

        this.newTurretLabel.setVisible(false)

        this.buttonLeft.setVisible(false)
        this.buttonLeft.removeInteractive()
        this.buttonLabelLeft.setVisible(false)

        this.buttonRight.setVisible(false)
        this.buttonRight.removeInteractive()
        this.buttonLabelRight.setVisible(false)
    }

    private onButtonTweenDone()
    {
        this.buttonLeft.setInteractive()
        this.buttonRight.setInteractive()
    }

    private onLeftButtonPressed()
    {
        this.emit('left_button_pressed')
    }

    private onRightButtonPressed()
    {
        this.emit('right_button_pressed')
    }
}
