import { Scene } from "phaser";

export default class Boot extends Scene
{
    public constructor ()
    {
        super({ key: 'Boot', active: true })
    }

    preload ()
    {
        this.load.image('loading_label', 'assets/loading_label.png')
    }

    create ()
    {
        this.registry.set('highscore', 0)

        this.scene.start('Preloader')
    }
}
