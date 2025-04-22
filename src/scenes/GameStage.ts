import { Scene } from "phaser";

export default class GameStage extends Scene
{
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
        this.add.bitmapText(100, 100, 'mini_font', 'Hello, World!!')

        const keyboard = this.input.keyboard
        if (keyboard)
        {
            keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.P).on(Phaser.Input.Keyboard.Events.UP, this.onPauseButtonReleased, this)
            keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q).on(Phaser.Input.Keyboard.Events.UP, this.onQuitButtonReleased, this)
        }
    }

    private onPauseButtonReleased ()
    {
        if (this.scene.isPaused('MainGame'))
        {
            this.scene.resume('MainGame')
        }
        else
        {
            this.scene.pause('MainGame')
        }
    }

    private onQuitButtonReleased()
    {
        this.scene.stop('MainGame')
        this.scene.start('MainMenu')
    }
}
