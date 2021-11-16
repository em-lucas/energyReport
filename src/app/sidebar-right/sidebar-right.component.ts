import { Component, OnInit } from '@angular/core';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { Subject } from 'rxjs';
import { ShapeLine } from '../energy.model';
import { EnergyService } from '../energy.service';

@Component({
  selector: 'app-sidebar-right',
  templateUrl: './sidebar-right.component.html',
  styleUrls: ['./sidebar-right.component.scss']
})
export class SidebarRightComponent implements  OnInit {
 
  titlePage: string = "Configuration"
  faTimes = faTimes;
  selectedShapMainValue: number;
  selectedShapSeondaryValue: number;
  listMainShapeLine: {id: number; name: string; checked: boolean}[] = [];
  listSecondaryShapeLine: {id: number; name: string; checked: boolean}[] = [];
  
  constructor(private energyService: EnergyService) {}

  ngOnInit(): void {
  
  //populate the lists
  for(var n in ShapeLine) {
      if (typeof ShapeLine[n] === 'number') {
        this.listMainShapeLine.push({id: <any>ShapeLine[n], name: n, checked: false});
        this.listSecondaryShapeLine.push({id: <any>ShapeLine[n], name: n, checked: false});
      }
  }
  this.selectedShapMainValue = this.energyService.getMainShapeLine();
  this.selectedShapSeondaryValue = this.energyService.getChildrenShapeLine();
  
  }

  onChangeShapeMainValue(){
    this.energyService.updateMainShapeLines(this.selectedShapMainValue);
  }

  onChangeShapeSecondaryValue(){
    this.energyService.updateSecondaryShapeLines(this.selectedShapSeondaryValue);
  }

  onCloseMenu(){
    this.energyService.closeConfigurationMenu.next();
  }
}



