import { Subject } from "rxjs";
import { Energy } from "./energy.model";

export class EnergyService{
    energyListChanged = new Subject<Energy[]>();
    startedEditingChild = new Subject<Energy>();

    private energyList: Energy[] = [
        new Energy(
            1,
            'Solar panel',
            '',
            'solar.png',
            false,
            []
        ),         
        new Energy(
            2,
            'Battery',
            '',
            'battery.png',
            false,
            []
        ),
        new Energy(
            3,
            'Wind power',
            '',
            'windmill.png',
            false,
            []
        ),
        new Energy(
            4,
            'Charging station',
            '',
            'charging-station.png',
            true,
            [
                new Energy(
                    30,
                    'Station 1',
                    '',
                    'charging-station.png',
                    true,
                    []
                ),
                new Energy(
                    31,
                    'Station 2',
                    '',
                    'charging-station.png',
                    true,
                    []
                ),

            ]
        ),
        new Energy(
            5,
            'Building',
            '',
            'building.png',
            true,
            []
        ),
        new Energy(
            6,
            'Nett',
            '',
            'nett.png',
            true,            
            [
                new Energy(
                    60,
                    'Station 1',
                    '',
                    'charging-station.png',
                    true,
                    []
                ),
                new Energy(
                    61,
                    'Station 2',
                    '',
                    'charging-station.png',
                    true,
                    []
                ),

            ]
        )
    ];

    getEnergyListAllItemsAvailable(): Energy[]{
        return this.energyList.filter(f => f.available).sort((a,b) => a.index > b.index ? 1 : -1).slice();
    }

    getEnergyListAllItems(): Energy[]{
        return this.energyList.sort((a,b) => a.index > b.index ? 1 : -1).slice();
    }

    updateEnergyAvailableItem(item: Energy): void{
        //this.energyList.
        let itemIndex = this.energyList.findIndex(itemArray => itemArray.index == item.index);
        this.energyList[itemIndex].available = item.available;

        var itemList:Energy[] = this.getEnergyListAllItemsAvailable();
      
        this.energyListChanged.next(itemList);        
    }

    updateEnergyAllItems(status: boolean): void{
        //this.energyList.fin
       
        this.energyList.forEach(item => item.available = status);

        var itemList:Energy[] = this.getEnergyListAllItemsAvailable();      
        this.energyListChanged.next(itemList);        
    }
}