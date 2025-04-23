import { Scene } from "phaser";
import { GAME_HEIGHT, GAME_WIDTH, LEVEL_UP_LABEL_DEPTH } from "../constants/GameConst";
import UpgradeCard from "../gameobjects/user-interfaces/upgrades/UpgradeCard";
import MainGame from "./MainGame";

export default class GameStage extends Scene
{
    private upgradeCards: UpgradeCard[]

    private levelUpLabel: Phaser.GameObjects.BitmapText

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
        this.upgradeCards = [
            this.add.existing(new UpgradeCard(this, 0)).on('upgrade_selected', this.onUpgradeCardGetSelected, this),
            this.add.existing(new UpgradeCard(this, 1)).on('upgrade_selected', this.onUpgradeCardGetSelected, this),
            this.add.existing(new UpgradeCard(this, 2)).on('upgrade_selected', this.onUpgradeCardGetSelected, this),
        ]

        this.levelUpLabel = this.add.bitmapText(GAME_WIDTH * 0.5, GAME_HEIGHT * 0.5, 'mini_font', 'Level Up!')
        this.levelUpLabel.setDepth(LEVEL_UP_LABEL_DEPTH)
        this.levelUpLabel.setVisible(false)

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
        this.levelUpLabel.setVisible(true)
        for (let i = 0; i < this.upgradeCards.length; i++)
        {
            this.upgradeCards[i].start(this.tweens)
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

    private onUpgradeCardGetSelected(cardIndex: number)
    {
        this.levelUpLabel.setVisible(false)
        console.log(`selected upgrade = ${cardIndex}`)
        this.scene.resume('MainGame')
        for (let i = 0; i < this.upgradeCards.length; i++)
        {
            this.upgradeCards[i].stop()
        }
        const mainGame = this.scene.get('MainGame') as MainGame
        mainGame.updateLevelProgress()
    }
}
