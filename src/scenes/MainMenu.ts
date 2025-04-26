import { Scene } from "phaser";
import { GAME_HEIGHT, GAME_WIDTH } from "../constants/GameConst";

const LABEL_OFFSET_Y = -300

const BUTTON_WIDTH = 256
const BUTTON_HEIGHT = 128

const CORNER_SIZE = 32

export default class MainMenu extends Scene
{
    constructor ()
    {
        super({ key: 'MainMenu', active: false })
    }

    create ()
    {
        const [ x, y ] = [ GAME_WIDTH * 0.5, GAME_HEIGHT * 0.5 ]

        const bg = this.add.image(x, y, 'menu_bg')
        bg.setDepth(1)

        const button1 = this.add.nineslice(x, y, 'metal_patch', undefined, BUTTON_WIDTH, BUTTON_HEIGHT, CORNER_SIZE, CORNER_SIZE, CORNER_SIZE, CORNER_SIZE)
        button1.setDepth(2)
        button1.on(Phaser.Input.Events.POINTER_DOWN, this.onButton1Pressed, this)
        button1.setInteractive()

        const label1 = this.add.bitmapText(x, y, 'mini_font', 'Play')
        label1.setOrigin(0.5, 0.5)
        label1.setDepth(3)

        const titleLabel = this.add.bitmapText(x, y + LABEL_OFFSET_Y, 'mini_font', 'SEESAWBLAST', 48)
        titleLabel.setOrigin(0.5, 0.5)
        titleLabel.setDepth(4)
    }

    private onButton1Pressed()
    {
        this.scene.start('GameStage')
    }
}
