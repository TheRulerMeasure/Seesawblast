import { Upgrades } from "../../../constants/GameConst"

export default class UpgradeCardConf
{
    public name: string | string[] = 'name'
    public descriptions: string[] = [ 'line1', 'line2' ]
    public upgrade: Upgrades = Upgrades.ENABLE_LASERS
}
