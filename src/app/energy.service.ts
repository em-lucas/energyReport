import { DOCUMENT } from "@angular/common";
import { Inject, Injectable, NgZone } from "@angular/core";
import { Subject } from "rxjs";
import { Energy, EnergyIntensity, EnergyStatus, ShapeLine } from "./energy.model";

@Injectable({
    providedIn: 'root'
})
export class EnergyService{
    energyListChanged = new Subject<Energy[]>();
    energyItemChanged = new Subject<Energy>();
    closeConfigurationMenu = new Subject();

    private energyList: Energy[] = [
        new Energy(
            1,
            'Solar panel',
            '',
            'solar.png',
            false,
            [ 
                new Energy(
                    10,
                    'Solar panel 1',
                    '',
                    'solar.png',
                    false,
                    [],
                    EnergyStatus.sending,
                    EnergyIntensity.low,
                    ShapeLine.line,
                    '#f2bb56'
                ),    
                new Energy(
                    11,
                    'Solar panel 2',
                    '',
                    'solar.png',
                    false,
                    [],
                    EnergyStatus.sending,
                    EnergyIntensity.low,
                    ShapeLine.line,
                    '#f2bb56'
                ),    
                new Energy(
                    12,
                    'Solar panel 3',
                    '',
                    'solar.png',
                    false,
                    [],
                    EnergyStatus.sending,
                    EnergyIntensity.low,
                    ShapeLine.line,
                    '#f2bb56'
                ),    
                new Energy(
                    13,
                    'Solar panel 4',
                    '',
                    'solar.png',
                    false,
                    [],
                    EnergyStatus.sending,
                    EnergyIntensity.low,
                    ShapeLine.line,
                    '#f2bb56'
                ),    
                new Energy(
                    14,
                    'Solar panel 5',
                    '',
                    'solar.png',
                    false,
                    [],
                    EnergyStatus.sending,
                    EnergyIntensity.low,
                    ShapeLine.line,
                    '#f2bb56'
                ),    
            ],
            EnergyStatus.sending,
            EnergyIntensity.low,
            ShapeLine.round,
            '#f2bb56'
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
            ShapeLine.round,
            '#8a8991'
        ),
        new Energy(
            3,
            'Wind power',
            '',
            'windmill.png',
            false,
            [],
            EnergyStatus.sending,            
            EnergyIntensity.min,
            ShapeLine.round,
            '#b0bad3'
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
                    ShapeLine.line,
                    '#7bbae9'
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
                    ShapeLine.line,
                    '#7bbae9'
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
                    ShapeLine.line,
                    '#7bbae9'
                ),

                new Energy(
                    33,
                    'Station 4',
                    '',
                    'charging-station.png',
                    false,
                    [],                    
                    EnergyStatus.consuming,            
                    EnergyIntensity.min,
                    ShapeLine.line,
                    '#7bbae9'
                ),

                new Energy(
                    34,
                    'Station 5',
                    '',
                    'charging-station.png',
                    false,
                    [],                    
                    EnergyStatus.consuming,            
                    EnergyIntensity.min,
                    ShapeLine.line,
                    '#7bbae9'
                ),

            ],    
           
            EnergyStatus.consuming,            
            EnergyIntensity.medium,
            ShapeLine.round,
            '#7bbae9'
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
            ShapeLine.round,
            '#cbd4dc'
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
                    'Nett 1',
                    '',
                    'nett.png',
                    true,
                    [],             
                    EnergyStatus.sending,            
                    EnergyIntensity.high,
                    ShapeLine.line,
                    '#96c8ef'
                ),
                new Energy(
                    61,
                    'Nett 2',
                    '',
                    'nett.png',
                    true,
                    [],
                    EnergyStatus.sending,            
                    EnergyIntensity.high,
                    ShapeLine.line,
                    '#96c8ef'
                ),
                new Energy(
                    62,
                    'Nett 3',
                    '',
                    'nett.png',
                    true,
                    [],
                    EnergyStatus.sending,            
                    EnergyIntensity.high,
                    ShapeLine.line,
                    '#96c8ef'
                ),
                new Energy(
                    63,
                    'Nett 4',
                    '',
                    'nett.png',
                    false,
                    [],
                    EnergyStatus.sending,            
                    EnergyIntensity.high,
                    ShapeLine.line,
                    '#96c8ef'
                ),
                new Energy(
                    64,
                    'Net 5',
                    '',
                    'nett.png',
                    false,
                    [],
                    EnergyStatus.sending,            
                    EnergyIntensity.high,
                    ShapeLine.line,
                    '#96c8ef'
                ),

            ],     
            EnergyStatus.sending,            
            EnergyIntensity.high,
            ShapeLine.round,
            '#96c8ef'
        ),

        
    ];

    constructor( 
                @Inject(DOCUMENT) private document: Document,
                private _ngZone: NgZone
                ){

        this.energyList.forEach(f => {
            const randomValue = Math.floor(Math.random() * 100);
            f.value = randomValue;

            switch (f.index) {
                case 1:
                    f.secondValue =  "KW";
                    break;
                case 2:
                    f.secondValue =  "%";
                    break;
                case 3:
                    f.secondValue =  "KW";
                    break;
                case 4:
                    f.secondValue =  "KW";
                    break;
                case 5:
                    f.secondValue =  "KW";
                    break;    
                case 6:
                    f.secondValue =  "Pri";
                    break;            
            }

            const childValue = Math.floor(randomValue / (f.childrenSource.length));

            if(f.childrenSource.length > 0){
                f.childrenSource.forEach((fchildItem, index) => {
                    fchildItem.value = childValue;


                    switch (f.index) {
                        case 1:
                            fchildItem.secondValue =  "KW";
                            break;
                        case 2:
                            fchildItem.secondValue =  "%";
                            break;
                        case 3:
                            fchildItem.secondValue =  "KW";
                            break;
                        case 4:
                            fchildItem.secondValue =  "KW";
                            break;
                        case 5:
                            fchildItem.secondValue =  "KW";
                            break;    
                        case 6:
                            fchildItem.secondValue =  "Pri"  + ' ' + index;
                            break;            
                    }
                });
            }
        });

        var increaseValue: boolean = true;
        //test update value
        this._ngZone.runOutsideAngular(() => {
            setInterval(() => 
            {
              this._ngZone.run(() => {
                var indexEnergyRandom = Math.floor(Math.random() * (this.energyList.length-1));
                
                if(increaseValue){

                    var newValue = Math.round(this.energyList[indexEnergyRandom].value * 1.2);
                    this.energyList[indexEnergyRandom].value = newValue >= 100 ? 100 : newValue;
                    this.energyItemChanged.next(this.energyList[indexEnergyRandom]); 
                    
                }else{
                    var newValue = Math.round(this.energyList[indexEnergyRandom].value * 0.8);
                    this.energyList[indexEnergyRandom].value = newValue <= 0 ? 0 : newValue;
                    this.energyItemChanged.next(this.energyList[indexEnergyRandom]); 
                }
                increaseValue = !increaseValue;       
              });
            }, 7000);
          });

          //this.updateMainShapeLines(ShapeLine.line);
          //this.updateEnergyAllItems(true);
    }

    getEnergyItem(index: number): Energy{
        const energyCopy = this.energyList.map(a => Object.assign({}, a));

        var energyItem = energyCopy.find(f=> f.index == index);
        if(energyItem.childrenSource.length > 0)
            energyItem.childrenSource = energyItem.childrenSource.filter(f => f.available);
        return energyItem;
    }

    getEnergyItemChildren(indexParent: number, indexChild: number): Energy{
        const energyCopy = this.energyList.map(a => Object.assign({}, a));

        const energyParent = energyCopy.find(f => f.index == indexParent);

        return energyParent.childrenSource.find(f=> f.index == indexChild);
    }

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

   setCssVar(varname: string, value: string) {
    this.document.body.style.setProperty(varname, value);
    }
}