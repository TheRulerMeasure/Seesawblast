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
        this.load.setPath('assets/textures/')

        this.load.image('seesaw', 'weapons/seesaw.png')
        this.load.image('seesaw_base', 'weapons/seesaw_base.png')

        this.load.image('small_gun', 'weapons/small_gun.png')
        this.load.image('gatling_gun', 'weapons/gatling_gun.png')
        this.load.image('laser', 'weapons/laser.png')

        this.load.image('weapon_crate', 'weapons/weapon_crate.png')

        this.load.image('gatling_gun_icon', 'user-interfaces/weapon-icons/gatling_gun_icon.png')

        this.load.image('bullet', 'projectiles/bullet.png')
        this.load.image('small_bullet', 'projectiles/small_bullet.png')

        this.load.spritesheet('small_explosion', 'effects/small_explosion_sheet.png', { frameWidth: 24, frameHeight: 24 })
        this.load.spritesheet('explosion', 'effects/explosion_sheet.png', { frameWidth: 128, frameHeight: 128 })
        this.load.spritesheet('muzzle_flash', 'effects/muzzle_flash_sheet.png', { frameWidth: 32, frameHeight: 32 })

        this.load.spritesheet('robo', 'mobs/robo_sheet.png', { frameWidth: 64, frameHeight: 64 })

        this.load.spritesheet('heart', 'user-interfaces/heart_sheet.png', { frameWidth: 32, frameHeight: 32 })
        this.load.image('level_progbar_over', 'user-interfaces/level_progbar_over.png')
        this.load.image('level_progbar_under', 'user-interfaces/level_progbar_under.png')
        this.load.image('scrap_progress', 'user-interfaces/scrap_progress.png')
        this.load.image('metal_patch', 'user-interfaces/metal_patch.png')

        this.load.spritesheet('scrap', 'props/scrap_sheet.png', { frameWidth: 48, frameHeight: 48 })

        this.load.setPath('assets/fonts/kenney-kenney-font/')

        this.load.bitmapFont('mini_font', 'kenney-mini-bmfont.png', 'kenney-mini-bmfont.xml')
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
