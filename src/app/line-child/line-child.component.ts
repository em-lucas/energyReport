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
    var lineConfig:LineConfig = new LineConfig(0,0,0,0,0);
    var heightChildren = parentDiv ? 0 : 3;      

   switch (sourceItem.intensity) {
    case EnergyIntensity.max:
      lineConfig.width = 10;
      lineConfig.height = 10;
      lineConfig.margin = 3;
      lineConfig.timer = 4.2;
    break;
    case EnergyIntensity.high:
      lineConfig.width = 9;
      lineConfig.height = 9;
      lineConfig.margin = 3.2;
      lineConfig.timer = 4.4;
    break;
    case EnergyIntensity.medium:
      lineConfig.width = 8;
      lineConfig.height = 8;
      lineConfig.margin = 3.4;
      lineConfig.timer = 4.6;
    break;
    case EnergyIntensity.low:
      lineConfig.width = 7;
      lineConfig.height = 7;
      lineConfig.margin = 3.6;  
      lineConfig.timer = 4.8;
    break;
    case EnergyIntensity.min:
      lineConfig.width = 6;
      lineConfig.height = 6;
      lineConfig.margin = 3.8;
      lineConfig.timer = 5;
    break;
    }

    lineConfig.timer = 5;

  //define the shape of the line based on the json
   switch (sourceItem.shapeLine) {
    case ShapeLine.line:
      lineConfig.shape = 0;
      lineConfig.width = 20;
      lineConfig.height = lineConfig.height - heightChildren;
      lineConfig.margin = 2;
    break;
    case ShapeLine.round:
      lineConfig.shape = 50;
    break;
    case ShapeLine.square:        
      lineConfig.shape =10;
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
    var dotsMiddle = Math.round(dotsNumber / 2);
    var animationTime =  0; //Math.round(dotsNumber * 0.2);

    var styleList: string[] = [];

    for (let index = 0; index < dotsNumber; index++) {
      
      var style = `height: ${height}px; width: ${width}px; margin: 0 ${marginLeftRigh}px; border-radius:${borderRadius}%;`;
     
      switch (true) {        
        case index < (dotsMiddle-2):
          style += ` animation: scalingSending ${timer} ease-in-out infinite;`
        break;
        case index == dotsMiddle-2:
          style += ` animation: scalingSending30porcent ${timer} ease-in-out infinite;`
        break;
        case index == dotsMiddle-1:        
        style += ` animation: scalingSending40porcent ${timer} ease-in-out infinite;`
        break;
        case index == dotsMiddle:        
        style += ` animation: scalingSending50porcent ${timer} ease-in-out infinite;`
        break;
        case index == dotsMiddle+1:        
        style += ` animation: scalingSending50porcent ${timer} ease-in-out infinite;`
        break;
        case index == dotsMiddle+2:        
        style += ` animation: scalingSending60porcent ${timer} ease-in-out infinite;`           
        break;   
        case index > dotsMiddle+2:        
        style += ` animation: scalingSending70porcent ${timer} ease-in-out infinite;`           
        break;   
        default:
          break;
      }

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
    var dotsMiddle = Math.round(dotsNumber / 2);
    var animationTime =  Math.round(dotsNumber * 0.2); //0;
     
    var styleList: string[] = [];

    for (let index = 0; index < dotsNumber; index++) {      
      var style = `height: ${height}px; width: ${width}px; margin: 0 ${marginLeftRigh}px; border-radius:${borderRadius}%;`;

      switch (true) {        
        case index < (dotsMiddle-2):
          style += ` animation: scalingConsuming70porcent ${timer} ease-in-out infinite;`  
        break;
        case index == dotsMiddle-2:
          style += ` animation: scalingConsuming60porcent ${timer} ease-in-out infinite;`   
        break;
        case index == dotsMiddle-1:        
        style += ` animation: scalingConsuming50porcent ${timer} ease-in-out infinite;`
        break;
        case index == dotsMiddle:        
        style += ` animation: scalingConsuming50porcent ${timer} ease-in-out infinite;`
        break;
        case index == dotsMiddle+1:        
        style += ` animation: scalingConsuming40porcent ${timer} ease-in-out infinite;`
        break;
        case index == dotsMiddle+2:         
        style += ` animation: scalingConsuming30porcent ${timer} ease-in-out infinite;`       
        break;   
        case index > dotsMiddle+2:          
        style += ` animation: scalingConsuming ${timer} ease-in-out infinite;`       
        break;   
        default:
          break;
      }

      style += "animation-delay:" + animationTime +"s;"
      animationTime = animationTime - 0.2;

      
      styleList.push(style);    

    }
    
    const viewContainerRef = this.lineHost.viewContainerRef;
    const componentRef = viewContainerRef.createComponent(LineGrandchildComponent);
    componentRef.instance.id = "consumingEnergy";
    componentRef.instance.class = "consuming";
    componentRef.instance.listStyle = styleList;  
  }
}
