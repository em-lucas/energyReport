import { Component, OnDestroy, OnInit } from '@angular/core';
import { faIndustry, faSlidersH } from '@fortawesome/free-solid-svg-icons';
import { Subscription } from 'rxjs';
import { Energy } from '../energy.model';
import { EnergyService } from '../energy.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit, OnDestroy {
  faIndustry = faIndustry;
  faSlidersH = faSlidersH;
  energyList: Energy[] = [];
  
  allItemChecked:boolean = false;
  showEnergySouceItems:boolean = false;
  showConfiguarition:boolean = false;
  private hideConfigurationMenu: Subscription;

  constructor(private energyService: EnergyService){}

  ngOnInit(): void {    
    this.energyList = this.energyService.getEnergyListAllItems();
    //this.energyList = this.energyList.filter(f => f.childrenSource = f.childrenSource.filter(fc => fc.available));
    
    //check if all building are checked
    this.allItemChecked = this.getItemsSelectedStatus();

    this.hideConfigurationMenu = this.energyService.closeConfigurationMenu.subscribe(
      () => {
        this.showConfiguarition = false;
      }
    )
  }

  getItemsSelectedStatus():boolean{
    //check the status of the all items if they are selected or not
    return (this.energyList.filter(e => e.available === true).length) === this.energyList.length;
  }

  onChanceAllSource(){
    //change all building either to selected or not selected mode
    this.allItemChecked = !this.allItemChecked;

    this.energyService.updateEnergyAllItems(this.allItemChecked);

    this.energyList.forEach(item => {
      item.available = this.allItemChecked;

      if(item.childrenSource.length > 0){
        item.childrenSource.forEach(element => {
          element.available = this.allItemChecked;
        });
      }
    });
  }

  onChanceSource(event:any, index: number){

    //change de status selected
    let itemIndex = this.energyList.findIndex(item => item.index == index);
    this.energyList[itemIndex].available = event.target.checked;       
 
    if(event.target.checked == false)
      this.energyList[itemIndex].childrenSource.forEach(item => item.available = event.target.checked);
 
    this.energyService.updateEnergyAvailableItem(this.energyList[itemIndex]);

    this.allItemChecked = !event.target.checked ? false : this.getItemsSelectedStatus();    
  }

  onChanceSourceChild(event:any, index: number, indexChild: number){
    //change de status selected
    let itemIndex = this.energyList.findIndex(item => item.index == index);
    let itemIndexChild = this.energyList[itemIndex].childrenSource.findIndex(itemChild => itemChild.index == indexChild);
    
    this.energyList[itemIndex].childrenSource[itemIndexChild].available = event.target.checked;     
       
 
    this.energyService.updateEnergyAvailableChild(this.energyList[itemIndex]);

    this.allItemChecked = !event.target.checked ? false : this.getItemsSelectedStatus();    
  }
  
  ngOnDestroy(): void {
    this.hideConfigurationMenu.unsubscribe();
  }
}
