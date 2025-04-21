import { Scene } from "phaser";
import { GAME_HEIGHT, GAME_WIDTH } from "../constants/GameConst";

export default class Preloader extends Scene
{
    public constructor ()
    {
        super({ key: 'Preloader', active: false })
    }

    init ()
    {
        this.add.image(GAME_WIDTH * 0.5, GAME_HEIGHT * 0.5, 'loading_label')
    }

    preload ()
    {
        this.load.image('seesaw', 'assets/seesaw.png')

        this.load.image('small_gun', 'assets/small_gun.png')
        this.load.image('gatling_gun', 'assets/gatling_gun.png')

        this.load.image('bullet', 'assets/bullet.png')
        this.load.image('small_bullet', 'assets/small_bullet.png')

        this.load.spritesheet('small_explosion', 'assets/small_explosion_sheet.png', { frameWidth: 24, frameHeight: 24 })
        this.load.spritesheet('explosion', 'assets/explosion_sheet.png', { frameWidth: 128, frameHeight: 128 })
        this.load.spritesheet('muzzle_flash', 'assets/muzzle_flash_sheet.png', { frameWidth: 32, frameHeight: 32 })

        this.load.spritesheet('robo', 'assets/robo_sheet.png', { frameWidth: 64, frameHeight: 64 })

        this.load.image('laser', 'assets/laser.png')
    }

    create ()
    {
        this.anims.create({
            key: 'robo_walk',
            frames: this.anims.generateFrameNumbers('robo', { frames: [ 0, 1 ] }),
            frameRate: 8,
            repeat: -1,
        })

        this.anims.create({
            key: 'small_explosion_explode',
            frames: this.anims.generateFrameNumbers('small_explosion', { frames: [ 0, 1, 2 ] }),
            duration: 250,
        })
        this.anims.create({
            key: 'explosion_explode',
            frames: this.anims.generateFrameNumbers('explosion', { frames: [ 0, 1, 2, 3, 4, 5 ] }),
            duration: 500,
        })
        this.anims.create({
            key: 'muzzle_flash_flash',
            frames: this.anims.generateFrameNumbers('muzzle_flash', { frames: [ 0, 1, 2 ] }),
            duration: 300,
        })

        this.scene.start('GameStage')
    }
}
