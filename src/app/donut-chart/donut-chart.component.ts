import { DOCUMENT } from '@angular/common';
import { Component, Inject, Injectable, Input, NgZone, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Subscription } from 'rxjs';
import { Energy } from '../energy.model';
import { EnergyService } from '../energy.service';
import { LineChildComponent } from '../line-child/line-child.component';
import { LineDirective } from '../line-child/line.directive';
import { DonutChartChildComponent } from './donut-chart-child/donut-chart-child.component';
import { DonutChildDirective } from './donut-child.directive';
import { DonutConfig } from './donutConfig.model';

@Component({
  selector: 'app-donut-chart',
  templateUrl: './donut-chart.component.html',
  styleUrls: ['./donut-chart.component.scss'],
  
})

export class DonutChartComponent implements OnInit, OnDestroy {
  @Input() idElementSource: number;
  @Input() mainDivStyle: string;
  @Input() theta:{id: number, value: number, borderA: number, borderB: number}[] = [];  
  @Input() widhtDiv:number;
  @Input() energyConfig: DonutConfig;
  
  @ViewChild(DonutChildDirective, {static: true}) donutChildHost!: DonutChildDirective;
 
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
  goUpImage: boolean = false;
  goDownImage: boolean = false;
  fadeOutText: boolean = false;
  fadeInText: boolean = false;
  interval;
  
  thetaGrandChildren:number[] = [];

  constructor(
              @Inject(DOCUMENT) private document: Document, 
              private energyService: EnergyService, 
              private route: ActivatedRoute,
              private _ngZone: NgZone
              ) { }


  ngOnInit(): void {

    
    this.changeEnergyItem = this.energyService.energyItemChanged.subscribe(  
      (newEnergyItem: Energy) => {     
      
        if(this.idElementSource == newEnergyItem.index){
          
            var endNumber = 100 - newEnergyItem.value;        
            this.porcentageNumber = newEnergyItem.value;
            this.secondValue = newEnergyItem.secondValue;
            var strokeEnd = `${newEnergyItem.value} ${endNumber}`;
            this.setNewValue(newEnergyItem.index, this.strokePercentual, strokeEnd); 
        }
    })

    // [ngClass]="{goUp: animationImageValues, goDown: !animationImageValues}"
    
    this.energyItem = this.energyService.getEnergyItem(this.idElementSource);   
       
    this.configSourceElement(this.energyItem.color, this.energyItem.imagePath);

    var endNumber = 100 - this.energyItem.value;        
    this.porcentageNumber = this.energyItem.value;
    this.secondValue = this.energyItem.secondValue;
    var strokeEnd = `${this.energyItem.value} ${endNumber}`;
    this.setNewValue(this.energyItem.index, "0, 100", strokeEnd ); 

    var firstTime: boolean = true;
    
    this._ngZone.runOutsideAngular(() => {
      this.interval = setInterval(() => {
        this._ngZone.run(() => { 
          this.textDonutHideFirstTime = false;
          //this.animationImageValues = !this.animationImageValues;    
          if(firstTime){
            this.goUpImage = true;
            this.fadeInText = true;
            firstTime = false;
          }
          else{
            // this.goUpImage = !this.goUpImage;
            // this.goDownImage = !this.goDownImage;
            // this.fadeInText = !this.fadeInText;
            // this.fadeOutText = !this.fadeOutText;
          }
        });
        
      }, 10000);
    });

    //check if the element source has children to show
    if(this.energyItem.childrenSource.length > 0)
      this.generateGrandChildrenElements();
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

  generateGrandChildrenElements() {

      //calc the distance between the children 
      var thetaTarget = this.theta.find(f => f.id === this.energyItem.index);
      var thetaChildren:number = 0;
      var range:number = 0;

      for (var i = 0; i < this.energyItem.childrenSource.length; i++) {
        range += (thetaTarget.borderA - thetaTarget.borderB) / (this.energyItem.childrenSource.length + 1);
        thetaChildren = range + thetaTarget.borderB;
        this.thetaGrandChildren.push(thetaChildren);
      }      

      
      this.createCirclesGrandchildren(this.energyItem.childrenSource);

      //clean for the next one
      this.thetaGrandChildren = [];
  }

  
  //create grandchildren circles around the parent circle
  createCirclesGrandchildren(energyChildrenSource: Energy[]) {

    let r = this.widhtDiv;      
    let mainHeight = 0; //parseInt(window.getComputedStyle(elementSource.children[0]).height.slice(0, -2));
        
    energyChildrenSource.forEach((energyItem, i) => {
    
      const posx = Math.round(r * (Math.cos(this.thetaGrandChildren[i])));
      const posy = Math.round(r * (Math.sin(this.thetaGrandChildren[i])));    

      energyItem.width = 75;
      energyItem.height = 75;
      energyItem.top = ((mainHeight / 2) - posy);
      energyItem.left = ((mainHeight/ 2 ) + posx);
      this.energyService.setCssVar("--widthDonutGrandchild", energyItem.width+'px'); //maybe change this have to check
      this.energyService.setCssVar("--heightDheightDonutGrandchildonutChild", energyItem.height+'px');
      
      var idElementSource = energyItem.index;
      var mainDivStyle = `position: absolute;z-index: 1;top: ${energyItem.top}px;left: ${energyItem.left}px;`;

      
      const viewContainerRef = this.donutChildHost.viewContainerRef;
      const componentRef = viewContainerRef.createComponent(DonutChartChildComponent);
      componentRef.instance.idElementSource = this.energyItem.index; 
      componentRef.instance.idElementSourceChild = idElementSource; 
      componentRef.instance.mainDivStyle = mainDivStyle;
      
    });     
             
    Promise.resolve().then(() => {
      this.generateChildLines(energyChildrenSource)
   });   
    
 }

 generateChildLines(energyChildrenSource: Energy[]) {   
  
   
  energyChildrenSource.forEach(sourceItem => {   
    this.connectLinesChildren(sourceItem, 5);
  });    
}

connectLinesChildren(sourceItem:Energy, thickness) { 
  
  // position of the line in the child div
  var x1 = sourceItem.left + (sourceItem.width / 2);
  var y1 = sourceItem.top + (sourceItem.height / 2);
  // position of the line in the Middle div
  var x2 =  (this.energyConfig.width / 2);
  var y2 = (this.energyConfig.height / 2);
  // distance
  var length = Math.sqrt(((x2-x1) * (x2-x1)) + ((y2-y1) * (y2-y1)));
  // center
  var cx = ((x1 + x2) / 2) - (length / 2);
  var cy = ((y1 + y2) / 2) - (thickness / 2);
  // angle
  var angle = Math.atan2((y1-y2),(x1-x2))*(180/Math.PI);


  //melhorar esse negocio aqui *************************
  var style = "padding:0px; margin:0px; height:" + thickness + "px; line-height:1px; position:absolute; left:" + cx + "px; top:" + cy + "px; width:" + length + "px; -moz-transform:rotate(" + angle + "deg); -webkit-transform:rotate(" + angle + "deg); -o-transform:rotate(" + angle + "deg); -ms-transform:rotate(" + angle + "deg); transform:rotate(" + angle + "deg);"

  const viewContainerRef = this.donutChildHost.viewContainerRef;
  const componentRef = viewContainerRef.createComponent(LineChildComponent);    
  componentRef.instance.style = style;
  componentRef.instance.sourceItem = sourceItem;
  componentRef.instance.length = length;
  componentRef.instance.parentDiv = false;
}

  ngOnDestroy(): void {
    clearInterval(this.interval);
    this.changeEnergyItem.unsubscribe();
  }
}


