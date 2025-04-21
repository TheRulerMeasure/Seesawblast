import { Scene } from "phaser";
import { GAME_HEIGHT, GAME_WIDTH } from "../constants/GameConst";

export default class MainMenu extends Scene
{
    constructor ()
    {
        super({ key: 'MainMenu', active: false })
    }

    create ()
    {
        this.add.image(GAME_WIDTH * 0.5, GAME_HEIGHT * 0.5, 'gatling_gun')
    }
}
