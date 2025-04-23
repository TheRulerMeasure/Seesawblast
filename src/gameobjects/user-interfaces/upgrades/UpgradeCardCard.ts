import UpgradeCardConf from "./UpgradeCardConf";

export class RapidFireLeft extends UpgradeCardConf
{
    constructor ()
    {
        super()
        this.name = 'RapidFire(Left)'
        this.descriptions = [
            'Increase the rate of fire',
            'of the Left turret.',
        ]
    }
}

export class RapidFireRight extends UpgradeCardConf
{
    constructor ()
    {
        super()
        this.name = 'RapidFire(Right)'
        this.descriptions = [
            'Increase the rate of fire',
            'of the Right turret.',
        ]
    }
}

export class PowerThePowerUp extends UpgradeCardConf
{
    constructor ()
    {
        super()
        this.name = 'Power the PowerUp'
        this.descriptions = [
            'Special turrets',
            'do 2x more damage.',
        ]
    }
}

export class BigGunLover extends UpgradeCardConf
{
    constructor ()
    {
        super()
        this.name = 'Big Guns Lover'
        this.descriptions = [
            'Increase the duration of',
            'Special turrets.',
        ]
    }
}

export class MoreDamageLeft extends UpgradeCardConf
{
    constructor ()
    {
        super()
        this.name = 'More Damage(Left)'
        this.descriptions = [
            'Increase the damage',
            'of the Left turret.',
        ]
    }
}

export class MoreDamageRight extends UpgradeCardConf
{
    constructor ()
    {
        super()
        this.name = 'More Damage(Right)'
        this.descriptions = [
            'Increase the damage',
            'of the Right turret.',
        ]
    }
}

export class SpinAndShoot extends UpgradeCardConf
{
    constructor ()
    {
        super()
        this.name = 'Spin n Shoot'
        this.descriptions = [
            'Turrets do 8x more damage',
            'when spinning fast.',
        ]
    }
}

export class BreathControl extends UpgradeCardConf
{
    constructor ()
    {
        super()
        this.name = 'Breath Control'
        this.descriptions = [
            'Turrets do 5x more damage',
            'after not firing a shot',
            'for 5 seconds',
        ]
    }
}
