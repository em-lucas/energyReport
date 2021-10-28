import { Component, OnInit } from '@angular/core';
import { faIndustry } from '@fortawesome/free-solid-svg-icons';
import { Energy } from '../energy.model';
import { EnergyService } from '../energy.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {
  faIndustry = faIndustry;
  energyList: Energy[] = [];
  
  allItemChecked:boolean = false;
  showBuildingItems:boolean = true;

  constructor(private energyService: EnergyService){}

  ngOnInit(): void {
    
    this.energyList = this.energyService.getEnergyListAllItems();
    
    //check if all building are checked
    this.allItemChecked = this.getBuildingSelectedStatus();
  }

  getBuildingSelectedStatus():boolean{
    //check the status of the all building if they are selected or not
    return (this.energyList.filter(e => e.available === true).length) === this.energyList.length;
  }

  onChanceAllSource(){
    //change all building either to selected or not selected mode
    this.allItemChecked = !this.allItemChecked;

    this.energyService.updateEnergyAllItems(this.allItemChecked);

    this.energyList.forEach(item => {
      item.available = this.allItemChecked
    });
  }

  onChanceSource(event:any, index: number){
    //change de status selected
    let itemIndex = this.energyList.findIndex(item => item.index == index);
    this.energyList[itemIndex].available = event.target.checked;       
 
    this.energyService.updateEnergyAvailableItem(this.energyList[itemIndex]);

    this.allItemChecked = !event.target.checked ? false : this.getBuildingSelectedStatus();    
  }

}
