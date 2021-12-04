import { DOCUMENT } from '@angular/common';
import { Component, Inject, Input, NgZone, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Energy } from 'src/app/energy.model';
import { EnergyService } from 'src/app/energy.service';

@Component({
  selector: 'app-donut-chart-child',
  templateUrl: './donut-chart-child.component.html',
  styleUrls: ['./donut-chart-child.component.scss']
})
export class DonutChartChildComponent implements OnInit, OnDestroy {

  @Input() mainDivStyle: string;
  @Input() idElementSource: number;
  @Input() idElementSourceChild: number;
  
  private changeEnergyItem: Subscription;
  energyItem: Energy;
  strokeDonutColor: string = "#d9e021";
  svgSourceItem =  "./assets/image/baterry.png"; // "/assets/image/windmill.png";  
  porcentageNumber: number;  
  secondValue: string;
  strokePercentual:string = "0 100";
  style: string;
  color: string;
  textDonutHideFirstTime: boolean = true;
  fadeIn: boolean = false;
  interval;
  
  
  constructor(
    @Inject(DOCUMENT) private document: Document, 
    private energyService: EnergyService, 
    private _ngZone: NgZone
  ) { }

  ngOnInit(): void {

    this.changeEnergyItem = this.energyService.energyItemChanged.subscribe(  
      (newEnergyItem: Energy) => {     
      
        if(this.idElementSource == newEnergyItem.index){
          
            var newElementChild =  Math.floor(newEnergyItem.value / newEnergyItem.childrenSource.length);
            var endNumber = 100 - newElementChild;        
            this.porcentageNumber = newElementChild;
            this.secondValue = newEnergyItem.secondValue;
            var strokeEnd = `${newElementChild} ${endNumber}`;
            this.setNewValue(''+this.idElementSourceChild, this.strokePercentual, strokeEnd); 
        }
    });

  this.energyItem = this.energyService.getEnergyItemChildren(this.idElementSource, this.idElementSourceChild);   
  this.configSourceElement(this.energyItem.color, this.energyItem.imagePath);

  var endNumber = 100 - this.energyItem.value;        
  this.porcentageNumber = this.energyItem.value;  
  this.secondValue = this.energyItem.secondValue;
  var strokeEnd = `${this.energyItem.value} ${endNumber}`;
  this.setNewValue(this.energyItem.index, "0, 100", strokeEnd ); 

  this._ngZone.runOutsideAngular(() => {
    this.interval = setInterval(() => {
        this._ngZone.run(() => { 
          this.textDonutHideFirstTime = false;
        this.fadeIn = !this.fadeIn;
        });        
      }, 10000);
    });
  }
  
  configSourceElement(color:string, pathImage:string) {    
    this.color = color;
    this.svgSourceItem = `./assets/image/${pathImage}`;
  }
  
  setNewValue(id: string, strokeStart: string, strokeEnd: string){  
    this.style = "";
    this.removeStyle(id);
    var effectName = `donutEffect${id}`
    this.setStyleKeyFrame(id, effectName, strokeStart, strokeEnd);
  
    this._ngZone.runOutsideAngular(() => {
      setTimeout(() => 
      {
        this._ngZone.run(() => {
          this.style = `animation:  ${effectName} 2s;`;
          this.strokePercentual = strokeEnd;
        });
      }, 1000);
    });
  }

  setStyleKeyFrame(id: string, effectName:string, strokeStart: string, strokeEnd: string) {
   
    var styleFrame = document.createElement('style');    
    
      var keyFrames = `
      @keyframes ${effectName} {
        0% {
            stroke-dasharray: ${strokeStart};
        }
        100% {
            stroke-dasharray:  ${strokeEnd};
        }
      }
      `;

    styleFrame.innerHTML = keyFrames;
    styleFrame.id = id;
    document.getElementsByTagName('head')[0].appendChild(styleFrame);
    
  }

  removeStyle(id:string){
    var styles = document.getElementsByTagName('style');
    var styleDelete;

    for (var i=0, max = styles.length; i < max; i++) {
      if(styles[i].id == id){
        styleDelete = styles[i];
      }
    }

    if(styleDelete)
      styleDelete.parentNode.removeChild(styleDelete);
  }


  ngOnDestroy(): void {
    clearInterval(this.interval);
    this.changeEnergyItem.unsubscribe();
  }
}
