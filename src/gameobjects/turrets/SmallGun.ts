import { Projectiles } from "../../constants/GameConst"
import Turret from "./Turret"

export default class SmallGun extends Turret
{
    constructor (scene: Phaser.Scene, x: number, y: number)
    {
        super(scene, x, y, 'small_gun')
        this.projectileType = Projectiles.BULLET
        this.maxFireDelay = 250
        this.maxForce = 2
    }
}
