import {  Component, Input, OnInit, Renderer2, ViewChild } from '@angular/core';
import { Energy, EnergyIntensity, EnergyStatus, ShapeLine } from 'src/app/energy.model';
import { LineConfig } from 'src/app/home-page/lineConfig.model';
import { LineGrandchildComponent } from './line-grandchild/line-grandchild.component';
import { LineDirective } from './line.directive';

@Component({
  selector: 'app-line-child',
  templateUrl: './line-child.component.html',
  styleUrls: ['./line-child.component.scss']
})
export class LineChildComponent implements OnInit {

  @Input() style;
  @Input() sourceItem:Energy;
  @Input() length: number;
  @Input() parentDiv: boolean;
  
  @ViewChild(LineDirective, {static: true}) lineHost!: LineDirective;
  
  constructor() { }

  ngOnInit(): void {        
    this.setEnergyFlow(this.length, this.sourceItem, this.parentDiv);
  }


  setEnergyFlow(totalLengthDivParent, sourceItem:Energy, parentDiv: boolean){   
    
    var lineConfig:LineConfig = this.getLineConfig(sourceItem, parentDiv);

    if(sourceItem.status == EnergyStatus.sending){
        this.lineDirectionSendingEnergy(totalLengthDivParent, lineConfig);
    }
    else if(sourceItem.status == EnergyStatus.consuming){
        this.lineDirectionConsumingEnergy(totalLengthDivParent, lineConfig);
    }
  }

  getLineConfig(sourceItem: Energy, parentDiv: boolean):LineConfig{
    var lineConfig:LineConfig = new LineConfig(0,0,0,0,0,0,"");
    var heightChildren = parentDiv ? 0 : 1;      

   switch (sourceItem.intensity) {
    case EnergyIntensity.max:
      lineConfig.width = 7.7;
      lineConfig.height = 7.7;
      lineConfig.margin = 3.4;
    break;
    case EnergyIntensity.high:
      lineConfig.width = 7.6;
      lineConfig.height = 7.6;
      lineConfig.margin = 3.5;
    break;
    case EnergyIntensity.medium:
      lineConfig.width = 7.4;
      lineConfig.height = 7.4;
      lineConfig.margin = 3.6;
    break;
    case EnergyIntensity.low:
      lineConfig.width = 7.2;
      lineConfig.height = 7.2;
      lineConfig.margin = 3.7;  
    break;
    case EnergyIntensity.min:
      lineConfig.width = 7;
      lineConfig.height = 7;
      lineConfig.margin = 3.8;
    break;
    }

    // lineConfig.width = 7;
    // lineConfig.height = 7;
    //lineConfig.margin = 3.6;  
    lineConfig.timer = 5;
    lineConfig.opacity = +sourceItem.intensity;

  //define the shape of the line based on the json
   switch (sourceItem.shapeLine) {
    case ShapeLine.line:
      lineConfig.shape = 20;
      lineConfig.width = 20;
      lineConfig.height = 4 - heightChildren;
      lineConfig.margin = 2;
      lineConfig.shapeName = "Line"
    break;
    case ShapeLine.round:
      lineConfig.shape = 50;
      lineConfig.shapeName = "Round"
    break;
    case ShapeLine.square:        
      lineConfig.shape = 20;      
      lineConfig.width = lineConfig.width - (parentDiv ? 0 : 3)
      lineConfig.height = lineConfig.height - (parentDiv ? 0 : 3)
      lineConfig.shapeName = "Square"
    break;
  } 

    return lineConfig;
  }

  lineDirectionSendingEnergy(length, lineConfig: LineConfig){
   
    var height= lineConfig.height;
    var width=  lineConfig.width;
    var marginLeftRigh = lineConfig.margin;
    var timer = lineConfig.timer + "s"
    var borderRadius = lineConfig.shape;

    var dotsNumber = Math.round(length / (width + (marginLeftRigh * 2))); //  width + 6.4 margin
    var animationTime =  0; //Math.round(dotsNumber * 0.2);

    var styleList: string[] = [];
    
    var style = `height: ${height}px; width: ${width}px; margin: 0 ${marginLeftRigh}px; border-radius:${borderRadius}%;`;
    style += ` animation: scalingSending${lineConfig.shapeName} ${timer} ease-in-out infinite; opacity: ${lineConfig.opacity};`

    for (let index = 0; index < dotsNumber; index++) {

      style += "animation-delay:" + animationTime +"s;"
      animationTime = animationTime + 0.4;

      styleList.push(style);      
    }
    
    const viewContainerRef = this.lineHost.viewContainerRef;
    const componentRef = viewContainerRef.createComponent(LineGrandchildComponent);
    componentRef.instance.id = "sendingEnergy";
    componentRef.instance.class = "sending";
    componentRef.instance.listStyle = styleList;     
  }
  
  lineDirectionConsumingEnergy(length, lineConfig: LineConfig){
    var height= lineConfig.height;
    var width=  lineConfig.width;
    var marginLeftRigh = lineConfig.margin;
    var timer = lineConfig.timer + "s";
    var borderRadius = lineConfig.shape;

    var dotsNumber = Math.round(length / (width + (marginLeftRigh * 2))); //  width + 6.4 margin
    var animationTime =  Math.round(dotsNumber * 0.2); //0;
     
    var styleList: string[] = [];

    var style = `height: ${height}px; width: ${width}px; margin: 0 ${marginLeftRigh}px; border-radius:${borderRadius}%;`;
    style += ` animation: scalingConsuming${lineConfig.shapeName} ${timer} ease-in-out infinite; opacity: ${lineConfig.opacity};`  

    for (let index = 0; index < dotsNumber; index++) {      
     
      style += "animation-delay:" + animationTime +"s;"
      animationTime = animationTime - 0.4;
      
      styleList.push(style);    
    }
    
    const viewContainerRef = this.lineHost.viewContainerRef;
    const componentRef = viewContainerRef.createComponent(LineGrandchildComponent);
    componentRef.instance.id = "consumingEnergy";
    componentRef.instance.class = "consuming";
    componentRef.instance.listStyle = styleList;  
  }
}
