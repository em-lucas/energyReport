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
    
    this.energyItem = this.energyService.getEnergyItem(this.idElementSource);   
       
    this.configSourceElement(this.energyItem.color, this.energyItem.imagePath);

    var endNumber = 100 - this.energyItem.value;        
    this.porcentageNumber = this.energyItem.value;
    this.secondValue = this.energyItem.secondValue;
    var strokeEnd = `${this.energyItem.value} ${endNumber}`;
    this.setNewValue(this.energyItem.index, "0, 100", strokeEnd ); 
  

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

      console.log(thetaTarget);
      
      
      //sample to alight better the circles      
      let r = this.widhtDiv;   
    
      var x1 = Math.round(r * (Math.cos(thetaTarget.borderA)));
      var y1 = Math.round(r * (Math.sin(thetaTarget.borderA)));  
      var x2 = Math.round(r * (Math.cos(thetaTarget.borderB)));
      var y2 = Math.round(r * (Math.sin(thetaTarget.borderB)));  
      var distance = 75/2; 

      // x1 = 10;
      // y1 = 10;
      // x2 = 10;
      // y2 = 20;

      // console.log('x1: '+ x1);
      // console.log('y1: ' +y1);
      
      // console.log('x2: '+ x2);
      // console.log('y2: ' +y2);
      

      var angle_A_B = Math.atan(thetaTarget.borderA-thetaTarget.borderB);
      var angle_A_B_test = Math.atan((y2-y1)-(x2-x1));
      //console.log(angle_A_B_test);
      
      var delta_x_A_C = ((distance*Math.PI) / 180) * Math.sin(angle_A_B)
      var delta_y_A_C = ((distance*Math.PI) / 180) * Math.cos(angle_A_B)
      console.log('delta_x_A_C ' + delta_x_A_C);
      console.log('delta_y_A_C ' + delta_y_A_C);

      console.log('distance: ' + Math.atan2(((distance*Math.PI) / 180),0));

      var angle = Math.atan2(delta_x_A_C,delta_y_A_C); // in radians
      var radius = Math.sqrt( Math.pow(delta_x_A_C, 2) + Math.pow(delta_y_A_C, 2) );
      console.log('angle ' + angle);
      console.log('radius ' + radius);
      console.log('borderB - radius ' + (radius - thetaTarget.borderB));


      
      var delta = angle / 2;

      // var delta_x_A_C = distance * Math.sin(angle_A_B)
      // var delta_y_A_C = distance * Math.cos(angle_A_B)

      // console.log(delta_x_A_C);
      // console.log(delta_y_A_C);
      
      // var x3 = x1+delta_x_A_C;
      // var y3 = y1+delta_y_A_C;

      // console.log('x3: '+ x3);
      // console.log('y3: ' +y3);

      //var xy3 = this.coordinatesMediumPoint(x1,y1,x2,y2, distance);
      //var xy3 = this.coordinatesMediumPoint(100,100,100,200, distance);
      
      //console.log('xy3 x3: '+ xy3.x);
      //console.log('xy3 y3: ' + xy3.y);
      //end of the sample

      
      var thetaChildren:number = 0;
      var range:number = 0;
      //var numberSplit = this.energyItem.childrenSource.length < 5 ? 6 : this.energyItem.childrenSource.length +1;
      var numberSplit = this.energyItem.childrenSource.length + 1;

      range = 0.34; //have to discover this number
      var halfPartAbove =  0.34 / 2;
      var halfPartBelow =  0.34 / 2;
      var isAbove = true;
      var firstTimeOdd = true;
      for (var i = 0; i < this.energyItem.childrenSource.length; i++) {
                
        if(this.energyItem.childrenSource.length % 2 == 0 ){ //even number
      
          if(isAbove){
            thetaChildren = halfPartAbove + thetaTarget.value;
            halfPartAbove +=  0.34;
            this.thetaGrandChildren.push(thetaChildren);
          }
          else{     
            thetaChildren = thetaTarget.value - halfPartBelow;
            halfPartBelow +=  0.34;       
            this.thetaGrandChildren.push(thetaChildren);
          }

          isAbove = !isAbove;
          
          
        }
        else{ //odd number
          
          if(firstTimeOdd){
            halfPartAbove = 0;
            halfPartBelow = 0;
            thetaChildren = thetaTarget.value;
            this.thetaGrandChildren.push(thetaChildren);

          }
          else if(isAbove){
            halfPartAbove +=  0.34;
            thetaChildren = halfPartAbove + thetaTarget.value;
            this.thetaGrandChildren.push(thetaChildren);
          }
          else{     
            halfPartBelow +=  0.34;       
            thetaChildren = thetaTarget.value - halfPartBelow;
            this.thetaGrandChildren.push(thetaChildren);
          }

          firstTimeOdd = false;
          isAbove = !isAbove;
          
        }
          

        // if(this.energyItem.childrenSource.length < 5){
        //   //se eh par


        //   //se eh impar
        //   range += (thetaTarget.borderA - thetaTarget.borderB) / numberSplit;
        //   thetaChildren = range + thetaTarget.borderB;
        //   this.thetaGrandChildren.push(thetaChildren);
        // }
        // else{
        //   range += (thetaTarget.borderA - thetaTarget.borderB) / numberSplit;
        //   thetaChildren = range + thetaTarget.borderB;
        //   this.thetaGrandChildren.push(thetaChildren);
        // }
      }      

      console.log('thetaGrandChildren');
      console.log(this.thetaGrandChildren);
      

      //calc distance between two points 
      // distance
      var x1 = Math.round(200 * (Math.cos(this.thetaGrandChildren[0])));
      var y1 = Math.round(200 * (Math.sin(this.thetaGrandChildren[0])));  
      var x2 = Math.round(200 * (Math.cos(this.thetaGrandChildren[1])));
      var y2 = Math.round(200 * (Math.sin(this.thetaGrandChildren[1])));  
      var length = Math.sqrt(((x2-x1) * (x2-x1)) + ((y2-y1) * (y2-y1)));
      // var length = Math.sqrt(this.thetaGrandChildren[0] + this.thetaGrandChildren[1]);
       console.log('x1: '+ x1);
      console.log('y1: ' +y1);
      
      console.log('x2: '+ x2);
      console.log('y2: ' +y2);
      console.log('distance');
      console.log(length);

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


