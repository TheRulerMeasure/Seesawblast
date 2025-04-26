import UpgradeCardConf from "./UpgradeCardConf";

export class LaserSights extends UpgradeCardConf
{
    constructor ()
    {
        super()
        this.name = [
            'Laser',
            'Sights',
        ]
        this.descriptions = [
            'Enable Laser',
            'Sights for',
            'both turrets.',
        ]
    }
}

const getUpgradeCardConfs = (): UpgradeCardConf[] => ([
    new LaserSights(),
    new LaserSights(),
    new LaserSights(),
    new LaserSights(),
])

export default getUpgradeCardConfs
