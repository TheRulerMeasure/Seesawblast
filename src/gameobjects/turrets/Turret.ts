import { Projectiles } from '../../constants/GameConst'

export default class Turret extends Phaser.GameObjects.Image
{
    public projectileType: Projectiles = Projectiles.BULLET
    public maxFireDelay: number = 250
    public maxForce: number = 2

    public inputFire: boolean = false

    private fireDelay: number = 0.0

    public update(_time: number, delta: number)
    {
        if (this.fireDelay < this.maxFireDelay)
        {
            this.fireDelay += delta
            if (this.inputFire && this.fireDelay >= this.maxFireDelay)
            {
                this.fireBullet()
                this.fireDelay = 0.0
            }
            return
        }
        if (this.inputFire)
        {
            this.fireBullet()
            this.fireDelay = 0.0
        }
    }

    private fireBullet()
    {
        this.emit('fired', this.projectileType)
    }
}
