import { Projectiles } from "../../constants/GameConst";
import Turret from "./Turret";

export default class GrenadeLauncher extends Turret
{
    constructor (scene: Phaser.Scene, x: number, y: number)
    {
        super(scene, x, y, 'grenade_launcher')
        this.projectileType = Projectiles.GRENADE
        this.maxFireDelay = 650
        this.maxForce = 5
    }
}
