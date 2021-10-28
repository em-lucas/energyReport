import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import interact from 'interactjs';
import { Subscription } from 'rxjs';
import { Energy } from '../energy.model';
import { EnergyService } from '../energy.service';

@Component({
  selector: 'app-sidebar-right',
  templateUrl: './sidebar-right.component.html',
  styleUrls: ['./sidebar-right.component.scss']
})
export class SidebarRightComponent implements  OnInit, OnDestroy {
  private startedEditingChild: Subscription;
  energy: Energy;
  titlePage: string = ""
  faTimes = faTimes;
  editModeActiveted: boolean = false;
  
  @ViewChild('form') themeForm?: NgForm;

  constructor(private energyService: EnergyService) {}


  ngOnInit(): void {

    const position = { x: 0, y: 0 }

    interact('.draggable').draggable({
      listeners: {
        start (event) {
          console.log(event.type, event.target)
        },
        move (event) {
          position.x += event.dx
          position.y += event.dy
    
          event.target.style.transform =
            `translate(${position.x}px, ${position.y}px)`
        },
      }
    })
    
    this.startedEditingChild = this.energyService.startedEditingChild.subscribe(
      (energy: Energy) => {
        this.editModeActiveted = true;
        this.energy = energy;
        this.setValues();
      }
    )
  }

  setValues(){
    this.titlePage = this.energy.name;
  }
  setTheme() {
  
  }


  ngOnDestroy(): void {
    this.startedEditingChild.unsubscribe();
  }

}

