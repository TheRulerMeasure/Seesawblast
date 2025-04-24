import { Scene } from "phaser";
import { GAME_HEIGHT, GAME_WIDTH, LEVEL_UP_LABEL_DEPTH } from "../constants/GameConst";
import UpgradeCard from "../gameobjects/user-interfaces/upgrades/UpgradeCard";
import MainGame from "./MainGame";
import UpgradeCardConf from "../gameobjects/user-interfaces/upgrades/UpgradeCardConf";
import getUpgradeCardConfs from "../gameobjects/user-interfaces/upgrades/UpgradeCardCard";

const getUniqueRandomNumbers = (min: number, max: number, count: number): number[] => {
    if (count > max - min + 1) {
        throw new Error("Count exceeds the range of unique numbers")
    }

    const uniqueNumbers = new Set<number>()

    while (uniqueNumbers.size < count) {
        const randomNum = Math.floor(Math.random() * (max - min + 1)) + min
        uniqueNumbers.add(randomNum)
    }

    return Array.from(uniqueNumbers)
}

export default class GameStage extends Scene
{
    private upgradeCardConfs: UpgradeCardConf[]

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
        this.upgradeCardConfs = getUpgradeCardConfs()

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

        for (let i = 0; i < 10; i++)
        {
            console.log(getUniqueRandomNumbers(1, 10, 5))
        }
    }

    public initUpgrade()
    {
        this.scene.pause('MainGame')

        this.levelUpLabel.setVisible(true)
        const nums = getUniqueRandomNumbers(0, this.upgradeCardConfs.length - 1, 3)
        for (let i = 0; i < nums.length; i++)
        {
            this.upgradeCards[i].start(this.tweens, this.upgradeCardConfs[nums[i]])
        }
    }

    private onPauseButtonReleased()
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
        mainGame.processUpgrade()
    }
}
