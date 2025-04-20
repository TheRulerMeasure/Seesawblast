import { GAME_HEIGHT, GAME_WIDTH } from './constants/GameConst'
import { Game as MainGame } from './scenes/Game'
import { AUTO, Game, Scale, Types } from 'phaser'

//  Find out more information about the Game Config at:
//  https://newdocs.phaser.io/docs/3.70.0/Phaser.Types.Core.GameConfig
const config: Types.Core.GameConfig = {
    type: AUTO,
    width: GAME_WIDTH,
    height: GAME_HEIGHT,
    parent: 'game-container',
    backgroundColor: '#86a392',
    scale: {
        mode: Scale.FIT,
        autoCenter: Scale.CENTER_BOTH,
    },
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { x : 0, y: 0 },
            debug: false,
        },
    },
    scene: [
        MainGame,
    ],
}

export default new Game(config)
