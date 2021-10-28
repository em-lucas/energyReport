import { HttpClientModule } from '@angular/common/http';
import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { Energy } from './energy.model';
import { EnergyService } from './energy.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit, AfterViewInit, OnDestroy {

  energyList: Energy[] = [];
  theta:{id: number, value: number}[] = [];
  thetaGrandChildren:number[] = [];
  circleArray:HTMLDivElement[] = [];
  circleArrayChildren:HTMLDivElement[] = [];
  numberCircle: number = 0;
  widhtDiv: number = 300;
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
      
        //div parent
        var circleParent = this.renderer.createElement('div');
        circleParent.id = energyItem.index;
        circleParent.className = 'circle';
        const posx = Math.round(r * (Math.cos(this.theta[i].value)));
        const posy = Math.round(r * (Math.sin(this.theta[i].value)));           
        circleParent.style.position = "absolute";
        circleParent.style.zIndex = "1";
        circleParent.style.top = ((this.mainHeight / 2) - posy) + 'px';
        circleParent.style.left = ((this.mainHeight/ 2 ) + posx) + 'px';

        //div child        
        var circleChild = this.renderer.createElement('div');

        var circleImg = this.renderer.createElement('img');     
        circleImg.src = '/assets/image/energy/' + energyItem.imagePath;
        circleImg.style.top =  '0px';
        circleImg.style.left = '0px';
                
        circleChild.appendChild(circleImg);
        circleParent.appendChild(circleChild);
        this.circleArray.push(circleParent);

        // var circleDiv = this.renderer.createElement('div');
        
        // circleDiv.id = energyItem.index;
        // circleDiv.appendChild(this.circleArray[i]);

        // if(energyItem.childrenSource.length > 0){
        //   this.circleArray[i].className += ' buttonChild'
        //   this.circleArray[i].addEventListener("click", function() {
           
        //     self.energyService.startedEditingChild.next(energyItem);
        //   });
        // }
        
        this.renderer.appendChild(this.main.nativeElement, circleParent);
        
      });
      console.log(this.circleArray);
      
      
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
      circleImg.src = '/assets/image/energy/' + energyItem.imagePath;
    
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
     this.generateChildLines(energyChildrenSource.length, elementSource)
     
 }

  //creation of the middle circle
  CreateGridCircle(){

    var circleImg = this.renderer.createElement('img');     
    circleImg.src = '/assets/image/energy/grid.png';
  

    var circleMiddle = this.renderer.createElement('div');
    circleMiddle.appendChild(circleImg);
    circleMiddle.id = 'grid';
    circleMiddle.className = 'circle middle';    
    circleMiddle.src = '/assets/image/energy/grid.png';
    circleMiddle.style.position = "absolute";
    circleMiddle.style.zIndex = "1";
    circleMiddle.style.top = (this.mainHeight / 2)  + 'px';
    circleMiddle.style.left = (this.mainHeight/ 2 ) + 'px';

    
    this.renderer.appendChild(this.main.nativeElement, circleMiddle);
  }

  connectLines(divAround, divMiddle, color, thickness) { 
    
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
    // var htmlLine = "<div style='padding:0px; margin:0px; height:" + thickness + "px; background-color:" + color + "; line-height:1px; position:absolute; left:" + cx + "px; top:" + cy + "px; width:" + length + "px; -moz-transform:rotate(" + angle + "deg); -webkit-transform:rotate(" + angle + "deg); -o-transform:rotate(" + angle + "deg); -ms-transform:rotate(" + angle + "deg); transform:rotate(" + angle + "deg);' />";
    // document.body.innerHTML += htmlLine; 
   
    var htmlLine = this.renderer.createElement('div');
    htmlLine.id = 'line';
    htmlLine.className = 'line';
    
    //melhorar esse negocio aqui *************************
    htmlLine.style = "padding:0px; margin:0px; height:" + thickness + "px; background-color:" + color + "; line-height:1px; position:absolute; left:" + cx + "px; top:" + cy + "px; width:" + length + "px; -moz-transform:rotate(" + angle + "deg); -webkit-transform:rotate(" + angle + "deg); -o-transform:rotate(" + angle + "deg); -ms-transform:rotate(" + angle + "deg); transform:rotate(" + angle + "deg);"
    
    this.renderer.appendChild(this.main.nativeElement, htmlLine);    
  }

  connectLinesChildren(divAround, divMiddle, color, thickness) { 
    
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
    
    //melhorar esse negocio aqui *************************
    htmlLine.style = "padding:0px; margin:0px; height:" + thickness + "px; background-color:" + color + "; line-height:1px; position:absolute; left:" + cx + "px; top:" + cy + "px; width:" + length + "px; -moz-transform:rotate(" + angle + "deg); -webkit-transform:rotate(" + angle + "deg); -o-transform:rotate(" + angle + "deg); -ms-transform:rotate(" + angle + "deg); transform:rotate(" + angle + "deg);"
    
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
      this.connectLines(divCircle, divMiddle, "#0F0", 5);
    }
  }

  generateChildLines(totalNumbChildren: number, elementSource: HTMLDivElement) {    
   
    for (var i = 0; i < totalNumbChildren; i++) {
      var divCircle = this.circleArrayChildren[i];
      this.connectLinesChildren(divCircle, elementSource, "#0F0", 5);
    }
  }

  generateEnergyReport() {
    this.resetDiv();

    let frags = 360 / this.numberCircle;   

    this.theta.push({ id : 0, value: (frags / 180) * (0) * Math.PI});
    this.energyList.forEach((element, i) => {
      this.theta.push({ id: element.index, value: (frags / 180) * (i+1) * Math.PI});
    });

    // for (var i = 0; i <= this.numberCircle; i++) {
    //     this.theta.push((frags / 180) * (i) * Math.PI);
    // }

    this.theta.sort((a,b) => a.value < b.value ? 1 : -1).slice();
    
    this.CreateGridCircle();
    this.CreateCircles()
  }
  
  generateGrandChildrenElements() {
        
    console.log(this.theta);
    this.energyList.filter(f =>  f.childrenSource.length > 0)

    .forEach(item =>{
      
      var thetaParent = this.theta.find(f => f.id === item.index).value; //* 0.1;
      console.log(thetaParent);
      
      let frags = (360 / this.numberCircle) / item.childrenSource.length;   
      for (var i = 0; i <= item.childrenSource.length; i++) {
          this.thetaGrandChildren.push((frags / 360) * (i - thetaParent) * Math.PI);
      }      
      
      this.thetaGrandChildren.sort((a,b) => a < b ? 1 : -1).slice();

      var elementSource: HTMLDivElement =  this.circleArray.find(f => f.id == item.index);
     
      this.createCirclesGrandchildren(item.childrenSource, elementSource.children[0]);

      console.log(this.thetaGrandChildren);
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
