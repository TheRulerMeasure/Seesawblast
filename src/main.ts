import { GAME_HEIGHT, GAME_WIDTH } from './constants/GameConst'
import { AUTO, Game, Scale, Types } from 'phaser'
import MainGame from './scenes/MainGame'
import Boot from './scenes/Boot'
import Preloader from './scenes/Preloader'
import GameStage from './scenes/GameStage'
import MainMenu from './scenes/MainMenu'

//  Find out more information about the Game Config at:
//  https://newdocs.phaser.io/docs/3.70.0/Phaser.Types.Core.GameConfig
const config: Types.Core.GameConfig = {
    type: AUTO,
    width: GAME_WIDTH,
    height: GAME_HEIGHT,
    parent: 'game-container',
    backgroundColor: '#838383',
    scale: {
        mode: Scale.FIT,
        autoCenter: Scale.CENTER_BOTH,
    },
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { x : 0, y: 0 },
            debug: true,
        },
    },
    scene: [
        Boot,
        Preloader,
        MainMenu,
        GameStage,
        MainGame,
    ],
}

export default new Game(config)
