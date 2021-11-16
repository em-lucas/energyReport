import { Subject } from "rxjs";
import { Energy, EnergyIntensity, EnergyStatus, ShapeLine } from "./energy.model";

export class EnergyService{
    energyListChanged = new Subject<Energy[]>();
    closeConfigurationMenu = new Subject();

    private energyList: Energy[] = [
        new Energy(
            1,
            'Solar panel',
            '',
            'solar.png',
            false,
            [],
            EnergyStatus.sending,
            EnergyIntensity.max,
            ShapeLine.round
        ),         
        new Energy(
            2,
            'Battery',
            '',
            'battery.png',
            false,
            [],
            EnergyStatus.consuming,            
            EnergyIntensity.high,
            ShapeLine.round
        ),
        new Energy(
            3,
            'Wind power',
            '',
            'windmill.png',
            false,
            [],
            EnergyStatus.sending,            
            EnergyIntensity.medium,
            ShapeLine.round
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
                    [],                    
                    EnergyStatus.consuming,            
                    EnergyIntensity.low,
                    ShapeLine.line
                ),
                new Energy(
                    31,
                    'Station 2',
                    '',
                    'charging-station.png',
                    true,
                    [],                   
                    EnergyStatus.consuming,            
                    EnergyIntensity.min,
                    ShapeLine.line
                ),
                new Energy(
                    32,
                    'Station 3',
                    '',
                    'charging-station.png',
                    true,
                    [],                    
                    EnergyStatus.consuming,            
                    EnergyIntensity.min,
                    ShapeLine.line
                ),

            ],            
            EnergyStatus.consuming,            
            EnergyIntensity.medium,
            ShapeLine.round
        ),
        new Energy(
            5,
            'Building',
            '',
            'building.png',
            true,
            [],                  
            EnergyStatus.consuming,            
            EnergyIntensity.max,
            ShapeLine.round
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
                    'nett.png',
                    true,
                    [],             
                    EnergyStatus.sending,            
                    EnergyIntensity.min,
                    ShapeLine.line
                ),
                new Energy(
                    61,
                    'Station 2',
                    '',
                    'nett.png',
                    true,
                    [],
                    EnergyStatus.sending,            
                    EnergyIntensity.min,
                    ShapeLine.line
                ),

            ],     
            EnergyStatus.sending,            
            EnergyIntensity.min,
            ShapeLine.round
        )
    ];

    getEnergyListAllItemsAvailable(): Energy[]{
        const energyCopy = this.energyList.map(a => Object.assign({}, a));
        return energyCopy.filter(f =>  f.available).filter(f => f.childrenSource = f.childrenSource.filter(fc => fc.available)).sort((a,b) => a.index > b.index ? 1 : -1)
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

    updateEnergyAvailableChild(item: Energy): void{
        //this.energyList.
        let itemIndex = this.energyList.findIndex(itemArray => itemArray.index == item.index);
        this.energyList[itemIndex].childrenSource = item.childrenSource;

        var itemList:Energy[] = this.getEnergyListAllItemsAvailable();
      
        this.energyListChanged.next(itemList);        
    }

    updateEnergyAllItems(status: boolean): void{
        //this.energyList.fin
       
        this.energyList.forEach(item => {
            item.available = status;
            item.childrenSource.forEach(element => element.available = status);
        });

        var itemList:Energy[] = this.getEnergyListAllItemsAvailable();      
        this.energyListChanged.next(itemList);        
    }

    
    getMainShapeLine(): ShapeLine{
        if(!this.energyList)
            return ShapeLine.round;

        return this.energyList[0].shapeLine;
   }

   updateMainShapeLines(shapeLine: ShapeLine):void{
    this.energyList.forEach(item => {
        item.shapeLine = shapeLine;
    });

    var itemList:Energy[] = this.getEnergyListAllItemsAvailable();      
    this.energyListChanged.next(itemList);    
   }

   getChildrenShapeLine(): ShapeLine{
        if(!this.energyList.filter(f => f.childrenSource.length > 0 )) 
            return ShapeLine.line;

        return this.energyList.filter(f => f.childrenSource.length > 0 )[0].childrenSource[0].shapeLine;
   }

   
   updateSecondaryShapeLines(shapeLine: ShapeLine):void{
    this.energyList.filter(f => f.childrenSource.length > 0 ).forEach(item => {
        item.childrenSource.forEach(item => item.shapeLine = shapeLine );
    });
    
    var itemList:Energy[] = this.getEnergyListAllItemsAvailable();      
    this.energyListChanged.next(itemList);    
   }
}