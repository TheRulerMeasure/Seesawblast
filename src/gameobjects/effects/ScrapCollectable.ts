import { GAME_HEIGHT, GAME_WIDTH } from "../../constants/GameConst"

export default class ScrapCollectable extends Phaser.GameObjects.Image
{
    public amount: number = 1

    public start(x: number, y: number, tween: Phaser.Tweens.TweenManager, amount: number)
    {
        this.amount = amount

        this.setScale(amount < 5 ? 0.6 : 1.0)
        this.setPosition(x, y)

        this.setFrame(Phaser.Math.Between(0, 3))

        this.setActive(true)
        this.setVisible(true)

        this.tween1(tween)
    }

    private tween1(tween: Phaser.Tweens.TweenManager)
    {
        let targetX = 45 + Math.random() * 50
        targetX *= Math.random() > 0.5 ? -1.0 : 1.0
        targetX += this.x
        let targetY = 45 + Math.random() * 50
        targetY *= Math.random() > 0.5 ? -1.0 : 1.0
        targetY += this.y
        const target2X = GAME_WIDTH * 0.5
        const target2Y = GAME_HEIGHT * 0.5
        const firstDuration = 800 + Math.random() * 400
        tween.chain({
            targets: this,
            persist: false,
            tweens: [
                {
                    x: { value: targetX, duration: firstDuration, ease: 'cubic.out' },
                    y: { value: targetY, duration: firstDuration + 100, ease: 'bounce.out' },
                },
                {
                    ease: 'linear',
                    duration: 1000,
                },
                {
                    x: target2X,
                    y: target2Y,
                    ease: 'back.in',
                    duration: 500,
                },
            ],
            onComplete: () => {
                this.emit('get_collected', this.amount)
                this.setActive(false)
                this.setVisible(false)
            },
        })
    }
}
