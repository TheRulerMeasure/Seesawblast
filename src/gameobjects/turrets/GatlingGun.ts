import { Projectiles } from "../../constants/GameConst"
import Turret from "./Turret"

export default class GatlingGun extends Turret
{
    constructor (scene: Phaser.Scene, x: number, y: number)
    {
        super(scene, x, y, 'gatling_gun')
        this.projectileType = Projectiles.SMALL_BULLET
        this.maxFireDelay = 75
        this.maxForce = 0.75
    }
}
