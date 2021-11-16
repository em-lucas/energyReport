import { HttpClientModule } from '@angular/common/http';
import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { Energy, EnergyIntensity, EnergyStatus, ShapeLine } from '../energy.model';
import { EnergyService } from '../energy.service';
import { LineConfig } from './lineConfig.model';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent implements OnInit, AfterViewInit, OnDestroy {

  energyList: Energy[] = [];
  theta:{id: number, value: number, borderA: number, borderB: number}[] = [];  
  roundShape: boolean = false;

  thetaGrandChildren:number[] = [];
  circleArray:HTMLDivElement[] = [];
  circleArrayChildren:HTMLDivElement[] = [];
  numberCircle: number = 0;
  widhtDiv: number = 200;
  mainHeight: number;
  @ViewChild("mainDiv") main: ElementRef;
  @ViewChild("lineDiv") line: ElementRef;
  private changeEnergyList: Subscription;

  constructor(private renderer: Renderer2, private http: HttpClientModule, private energyService: EnergyService){ }
  
  ngOnInit(): void {    
    this.energyList = this.energyService.getEnergyListAllItemsAvailable();
    
    this.numberCircle = this.energyList.length;
    
    this.changeEnergyList = this.energyService.energyListChanged.subscribe(
      (energyUpdatedList: Energy[]) => {
        this.energyList = energyUpdatedList;
        this.numberCircle = this.energyList.length;
        this.generateEnergyReport();
      }
    )
  }

  ngAfterViewInit() {
    this.mainHeight = parseInt(window.getComputedStyle(this.main.nativeElement).height.slice(0, -2));
    this.generateEnergyReport();
  }

  //create circles around the middle circle
  CreateCircles() {
     //var self = this;
      let r = this.widhtDiv;      

      this.energyList.forEach((energyItem, i) => {
        var theta = this.theta.find(f => f.id == energyItem.index);
       
        //div parent
        var circleParent = this.renderer.createElement('div');
        circleParent.id = energyItem.index;
        circleParent.className = 'circle';
        const posx = Math.round(r * (Math.cos(theta.value)));
        const posy = Math.round(r * (Math.sin(theta.value)));           
        circleParent.style.position = "absolute";
        circleParent.style.zIndex = "1";
        circleParent.style.top = ((this.mainHeight / 2) - posy) + 'px';
        circleParent.style.left = ((this.mainHeight/ 2 ) + posx) + 'px';

        //div child        
        var circleChild = this.renderer.createElement('div');
        circleChild.className = "children";
        
        var divImg = this.renderer.createElement('div');
        divImg.className = "first-child";
      
        var circleImg = this.renderer.createElement('img');     
        circleImg.src = './assets/image/energy/' + energyItem.imagePath;
                                
        circleChild.appendChild(divImg);
        divImg.appendChild(circleImg);
        circleParent.appendChild(circleChild);
        this.circleArray.push(circleParent);
        
        this.renderer.appendChild(this.main.nativeElement, circleParent);        
      });      
      
      this.generateLines();    
      
      //check and generate grandchildren elements
      this.generateGrandChildrenElements()
  }

  //create grandchildren circles around the parent circle
  createCirclesGrandchildren(energyChildrenSource: Energy[], elementSource) {

     let r = this.widhtDiv;      
     let mainHeight = 0; //parseInt(window.getComputedStyle(elementSource.children[0]).height.slice(0, -2));
         
     energyChildrenSource.forEach((energyItem, i) => {
     
      var circleImg = this.renderer.createElement('img');     
      circleImg.src = './assets/image/energy/' + energyItem.imagePath;
      circleImg.className = 'circleGrandChildren';
    
      var circle = this.renderer.createElement('div');
      circle.id = energyItem.index;
       
       circle.className = 'circle';
       const posx = Math.round(r * (Math.cos(this.thetaGrandChildren[i])));
       const posy = Math.round(r * (Math.sin(this.thetaGrandChildren[i])));           
       circle.style.position = "absolute";
       circle.style.zIndex = "1";
       circle.style.top = ((mainHeight / 2) - posy) + 'px';
       circle.style.left = ((mainHeight/ 2 ) + posx) + 'px';
       
       this.circleArrayChildren.push(circle);
       circle.appendChild(circleImg);
       this.renderer.appendChild(elementSource, this.circleArrayChildren[i]);      
       
     });     
          
     this.generateChildLines(energyChildrenSource, elementSource);
  }

  //creation of the middle circle
  CreateCentralCircle(){
    var circleImg = this.renderer.createElement('img');     
    circleImg.src = './assets/image/energy/grid.png';
  
    var circleMiddle = this.renderer.createElement('div');
    circleMiddle.appendChild(circleImg);

    circleMiddle.id = 'grid';
    circleMiddle.className = 'circle middle';    
    circleMiddle.src = '/assets/image/energy/grid.png';
    circleMiddle.style.position = "absolute";
    circleMiddle.style.zIndex = "1";
    circleMiddle.style.top = (this.mainHeight / 2) + 'px';
    circleMiddle.style.left = (this.mainHeight/ 2 ) + 'px';

    this.renderer.appendChild(this.main.nativeElement, circleMiddle);
  }

  connectLines(divAround, divMiddle, thickness) { 
 
    var off1 = this.getOffset(divAround);
    var off2 = this.getOffset(divMiddle);
    // position of the line in the child div
    var x1 = off1.left + (off1.width / 2);
    var y1 = off1.top + (off1.height / 2);
    // position of the line in the Middle div
    var x2 = off2.left + (off2.width / 2);
    var y2 = off2.top + (off2.height / 2);
    // distance
    var length = Math.sqrt(((x2-x1) * (x2-x1)) + ((y2-y1) * (y2-y1)));
    // center
    var cx = ((x1 + x2) / 2) - (length / 2);
    var cy = ((y1 + y2) / 2) - (thickness / 2);
    // angle
    var angle = Math.atan2((y1-y2),(x1-x2))*(180/Math.PI);

    // make hr
    // var htmlLine = "<div style='height:" + thickness + "px; line-height:1px; position:absolute; left:" + cx + "px; top:" + cy + "px; width:" + length + "px; -moz-transform:rotate(" + angle + "deg); -webkit-transform:rotate(" + angle + "deg); -o-transform:rotate(" + angle + "deg); -ms-transform:rotate(" + angle + "deg); transform:rotate(" + angle + "deg);' />";
    // document.body.innerHTML += htmlLine; 
   
    var htmlLine = this.renderer.createElement('div');
    htmlLine.id = 'line' + divAround.id;
    htmlLine.className = 'line';
    
    let sourceItem = this.energyList.find(f => f.index == divAround.id);
    this.setEnergyFlow(htmlLine, length, sourceItem, true);
    
    //melhorar esse negocio aqui *************************
    htmlLine.style = "padding:0px; margin:0px; height:" + thickness + "px; line-height:1px; position:absolute; left:" + cx + "px; top:" + cy + "px; width:" + length + "px; -moz-transform:rotate(" + angle + "deg); -webkit-transform:rotate(" + angle + "deg); -o-transform:rotate(" + angle + "deg); -ms-transform:rotate(" + angle + "deg); transform:rotate(" + angle + "deg);"
    
    this.renderer.appendChild(this.main.nativeElement, htmlLine);    
  }

  setEnergyFlow(htmlLine, totalLengthDivParent, sourceItem:Energy, parentDiv: boolean){   
    
    var lineConfig:LineConfig = this.getLineConfig(sourceItem, parentDiv);

    if(sourceItem.status == EnergyStatus.sending){
        this.lineDirectionSendingEnergy(htmlLine, totalLengthDivParent, lineConfig);
    }
    else if(sourceItem.status == EnergyStatus.consuming){
        this.lineDirectionConsumingEnergy(htmlLine, totalLengthDivParent, lineConfig);
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
      lineConfig.timer = 2;
    break;
    case EnergyIntensity.high:
      lineConfig.width = 9;
      lineConfig.height = 9;
      lineConfig.margin = 3.2;
      lineConfig.timer = 2.5;
    break;
    case EnergyIntensity.medium:
      lineConfig.width = 8;
      lineConfig.height = 8;
      lineConfig.margin = 3.4;
      lineConfig.timer = 3;
    break;
    case EnergyIntensity.low:
      lineConfig.width = 7;
      lineConfig.height = 7;
      lineConfig.margin = 3.6;  
      lineConfig.timer = 3.5;
    break;
    case EnergyIntensity.min:
      lineConfig.width = 6;
      lineConfig.height = 6;
      lineConfig.margin = 3.8;
      lineConfig.timer = 4;
    break;
    }

  //define the shape of the line based on the json
   switch (sourceItem.shapeLine) {
    case ShapeLine.line:
      lineConfig.shape = 15;
      lineConfig.width = 20;
      lineConfig.height = lineConfig.height - heightChildren;
      lineConfig.margin = 0;
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

  lineDirectionSendingEnergy(htmlLine, length, lineConfig: LineConfig){
    var height= lineConfig.height;
    var width=  lineConfig.width;
    var marginLeftRigh = lineConfig.margin;
    var timer = lineConfig.timer + "s"
    var borderRadius = lineConfig.shape;

    var dotsNumber = Math.round(length / (width + (marginLeftRigh * 2))); //  width + 6.4 margin
    var dotsMiddle = Math.round(dotsNumber / 2);
    var animationTime =  0; //Math.round(dotsNumber * 0.2);

    var divSendingEnergy = this.renderer.createElement('div');  
    divSendingEnergy.id = "sendingEnergy";
    divSendingEnergy.className = "sending";

    for (let index = 0; index < dotsNumber; index++) {
      var htmlLineDot = this.renderer.createElement('div');  
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
      animationTime = animationTime + 0.2;

      htmlLineDot.style = style;
      divSendingEnergy.appendChild(htmlLineDot)
      htmlLine.appendChild(divSendingEnergy);
    }
  }
  
  lineDirectionConsumingEnergy(htmlLine, length, lineConfig: LineConfig){
    var height= lineConfig.height;
    var width=  lineConfig.width;
    var marginLeftRigh = lineConfig.margin;
    var timer = lineConfig.timer + "s";
    var borderRadius = lineConfig.shape;

    var dotsNumber = Math.round(length / (width + (marginLeftRigh * 2))); //  width + 6.4 margin
    var dotsMiddle = Math.round(dotsNumber / 2);
    var animationTime =  Math.round(dotsNumber * 0.2); //0;
    
    var divConsumingEnergy = this.renderer.createElement('div');  
    divConsumingEnergy.id = "consumingEnergy";
    divConsumingEnergy.className = "consuming";

    for (let index = 0; index < dotsNumber; index++) {
      var htmlLineDot = this.renderer.createElement('div');        
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

      htmlLineDot.style = style;
      divConsumingEnergy.appendChild(htmlLineDot)
      htmlLine.appendChild(divConsumingEnergy);
    }
  }


  connectLinesChildren(energyChildrenSource: Energy[], divAround, divMiddle, color, thickness) { 
    
    var off1 = this.getOffset(divAround);
    var off2 = this.getOffset(divMiddle.children[0]);
    // position of the line in the child div
    var x1 = off1.left + (off1.width / 2);
    var y1 = off1.top + (off1.height / 2);
    // position of the line in the Middle div
    var x2 = off2.left + (off2.width / 2);
    var y2 = off2.top + (off2.height / 2);
    // distance
    var length = Math.sqrt(((x2-x1) * (x2-x1)) + ((y2-y1) * (y2-y1)));
    // center
    var cx = ((x1 + x2) / 2) - (length / 2);
    var cy = ((y1 + y2) / 2) - (thickness / 2);
    // angle
    var angle = Math.atan2((y1-y2),(x1-x2))*(180/Math.PI);

    // make hr
    // var htmlLine = "<div style='padding:0px; margin:0px; height:" + thickness + "px; background-color:" + color + "; line-height:1px; position:absolute; left:" + cx + "px; top:" + cy + "px; width:" + length + "px; -moz-transform:rotate(" + angle + "deg); -webkit-transform:rotate(" + angle + "deg); -o-transform:rotate(" + angle + "deg); -ms-transform:rotate(" + angle + "deg); transform:rotate(" + angle + "deg);' />";
    // document.body.innerHTML += htmlLine; 
   
    var htmlLine = this.renderer.createElement('div');
    htmlLine.id = 'line';
    htmlLine.className = 'line';
    
    let sourceItem = energyChildrenSource.find(f => f.index == divAround.id);
       
    this.setEnergyFlow(htmlLine, length, sourceItem, false);

    //melhorar esse negocio aqui *************************
    htmlLine.style = "padding:0px; margin:0px; height:" + thickness + "px; line-height:1px; position:absolute; left:" + cx + "px; top:" + cy + "px; width:" + length + "px; -moz-transform:rotate(" + angle + "deg); -webkit-transform:rotate(" + angle + "deg); -o-transform:rotate(" + angle + "deg); -ms-transform:rotate(" + angle + "deg); transform:rotate(" + angle + "deg);"
    
    this.renderer.appendChild(divMiddle, htmlLine);    
  }
  
  getOffset(el) {
    var style = window.getComputedStyle(el);
    
    var top = parseInt(style.getPropertyValue('top').slice(0, -2));
    var left = parseInt(style.getPropertyValue('left').slice(0, -2));
    var width = parseInt(style.getPropertyValue('width').slice(0, -2));
    var height = parseInt(style.getPropertyValue('height').slice(0, -2));

    return {
        left: left + window.pageXOffset,
        top: top + window.pageYOffset,
        width: width || el.offsetWidth,
        height: height || el.offsetHeight
    };
  }

  generateLines() {    
    let divMiddle:ElementRef = this.main.nativeElement.children[0];


    for (var i = 0; i < this.numberCircle; i++) {
      var divCircle = this.circleArray[i];
      this.connectLines(divCircle, divMiddle, 5);
    }
  }

  generateChildLines(energyChildrenSource: Energy[], elementSource: HTMLDivElement) {   
   
    var totalNumbChildren: number = energyChildrenSource.length;

    for (var i = 0; i < totalNumbChildren; i++) {
      var divCircle = this.circleArrayChildren[i];
      this.connectLinesChildren(energyChildrenSource, divCircle, elementSource, "#0F0", 5);
    }
  }

  generateEnergyReport() {
    this.resetDiv();

    let frags = 360 / this.numberCircle;   

    if(this.energyList.length == 0)
      return;

    this.theta.push({ id : 0, value: (frags / 180) * (0) * Math.PI,  borderA: -1, borderB: -1});
    this.energyList.forEach((element, i) => {
      this.theta.push({ id: element.index, value: (frags / 180) * (i+1) * Math.PI,  borderA: -1, borderB: -1});
    });

    //find the limit of the angle 
    var border = (this.theta[0].value + this.theta[1].value) / 2;
   
    //fill the border A and B with the limit of the angle
    for (var i = 0; i <= this.numberCircle; i++) {
      var position = this.theta[i].value + border;
      
      this.theta[i].borderA = position;
      if(i !== this.numberCircle)
        this.theta[i+1].borderB = position;
      else
        this.theta[0].borderA = -1;
    }
    
    this.theta.shift();
    //this.theta.sort((a,b) => a.id < b.id ? 1 : -1).slice();
    
    this.CreateCentralCircle();
    this.CreateCircles()
  }
  
  generateGrandChildrenElements() {

    this.energyList.filter(f =>  f.childrenSource.length > 0) //return the elements that have children
    .forEach((item, j) =>{
      
      //calc the distance between the children 
      var thetaTarget = this.theta.find(f => f.id === item.index);
      var thetaChildren:number = 0;
      var range:number = 0;

      for (var i = 0; i < item.childrenSource.length; i++) {
        range += (thetaTarget.borderA - thetaTarget.borderB) / (item.childrenSource.length + 1);
        thetaChildren = range + thetaTarget.borderB;
        this.thetaGrandChildren.push(thetaChildren);
      }      
      
      //this.thetaGrandChildren.sort((a,b) => a < b ? 1 : -1).slice();

      var elementSource: HTMLDivElement =  this.circleArray.find(f => f.id == item.index);
     
      this.createCirclesGrandchildren(item.childrenSource, elementSource.children[0]);

      //clean for the next one
      this.thetaGrandChildren = [];
      this.circleArrayChildren = [];
    });
  }

  resetDiv(){    
    this.theta = [];   
    this.circleArray = [];   

    //delete children circles
    const myEl = this.main.nativeElement;  
    while(myEl.firstChild) {
      this.renderer.removeChild(myEl, myEl.lastChild);      
    }    
  }

  ngOnDestroy(): void {
    this.changeEnergyList.unsubscribe();
  }

}
