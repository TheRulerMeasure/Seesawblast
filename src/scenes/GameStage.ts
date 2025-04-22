import { Scene } from "phaser";
import { GAME_HEIGHT, GAME_WIDTH } from "../constants/GameConst";

export default class GameStage extends Scene
{
    private upgradePanels: Phaser.GameObjects.NineSlice[]

    private upgradeLabel: Phaser.GameObjects.BitmapText

    constructor ()
    {
        super({ key: 'GameStage', active: false })
    }

    init ()
    {
        this.scene.launch('MainGame')
        this.scene.bringToTop('GameStage')
    }

    create ()
    {
        this.upgradePanels = [
            this.add.nineslice(GAME_WIDTH * 0.5, GAME_HEIGHT * 0.5, 'metal_patch', undefined, 200, 300, 32, 32, 32, 32),
        ]
        for (let i = 0; i < this.upgradePanels.length; i++)
        {
            this.upgradePanels[i].setVisible(false)
        }

        this.upgradeLabel = this.add.bitmapText(GAME_WIDTH * 0.5, GAME_HEIGHT * 0.5, 'mini_font', 'Level Up!')
        this.upgradeLabel.setVisible(false)

        const keyboard = this.input.keyboard
        if (keyboard)
        {
            keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.P).on(Phaser.Input.Keyboard.Events.UP, this.onPauseButtonReleased, this)
            keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q).on(Phaser.Input.Keyboard.Events.UP, this.onQuitButtonReleased, this)
        }
    }

    public initUpgrade()
    {
        this.scene.pause('MainGame')
        this.upgradeLabel.setVisible(true)
        for (let i = 0; i < this.upgradePanels.length; i++)
        {
            this.upgradePanels[i].setVisible(true)
        }
    }

    private onPauseButtonReleased ()
    {

    }

    private onQuitButtonReleased()
    {
        this.scene.stop('MainGame')
        this.scene.start('MainMenu')
    }
}
