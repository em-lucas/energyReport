import { HttpClientModule } from '@angular/common/http';
import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { DonutChartMiddleComponent } from '../donut-chart-middle/donut-chart-middle.component';
import { DonutChartComponent } from '../donut-chart/donut-chart.component';
import { DonutConfig } from '../donut-chart/donutConfig.model';
import { EnergyDirective } from '../energy.directie';
import { Energy } from '../energy.model';
import { EnergyService } from '../energy.service';
import { LineChildComponent } from '../line-child/line-child.component';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild(EnergyDirective, {static: true}) energyHost!: EnergyDirective;
  energyList: Energy[] = [];
  energyControlItem: Energy;
  theta:{id: number, value: number, borderA: number, borderB: number}[] = [];  

  numberCircle: number = 0;
  widhtDiv: number = 200;
  mainHeight: number;
  @ViewChild("mainDiv") main: ElementRef;
  private changeEnergyList: Subscription;

  constructor(
    private renderer: Renderer2, 
    private http: HttpClientModule, 
    private energyService: EnergyService,
    private cd: ChangeDetectorRef){ }
  
  ngOnInit(): void {    
    
    this.energyList = this.energyService.getEnergyListAllItemsAvailable();
    
    this.numberCircle = this.energyList.length;
    
    this.changeEnergyList = this.energyService.energyListChanged.subscribe(
      (energyUpdatedList: Energy[]) => {     
        this.energyList = energyUpdatedList;
        this.numberCircle = this.energyList.length;
        this.generateEnergyReport();
      }
    );    
  }

  ngAfterViewInit() {
    
        this.mainHeight = parseInt(window.getComputedStyle(this.main.nativeElement).height.slice(0, -2));          
        this.generateEnergyReport();
        this.cd.detectChanges();
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

  
  //creation of the middle circle
  CreateCentralCircle(){

    this.energyControlItem = {
      width: 70,
      height: 70,
      top:  this.mainHeight / 2,
      left: this.mainHeight / 2,
    };
    
    this.energyService.setCssVar("--widthDonutControl", this.energyControlItem.width+'px');
    this.energyService.setCssVar("--heightDonutControl", this.energyControlItem.height+'px');
    
    var style = `position: absolute; z-index: 1; top: ${this.energyControlItem.top}px; left: ${this.energyControlItem.left}px;`;

    const viewContainerRef = this.energyHost.viewContainerRef;
    const componentRef = viewContainerRef.createComponent(DonutChartMiddleComponent);
    componentRef.instance.style = style;

  }

  //create circles around the middle circle
  CreateCircles() {
    //var self = this;
     let r = this.widhtDiv;      

     this.energyList.forEach((energyItem, i) => {
       var theta = this.theta.find(f => f.id == energyItem.index);
      
       const posx = Math.round(r * (Math.cos(theta.value)));
       const posy = Math.round(r * (Math.sin(theta.value)));           
       
       energyItem.width = 85;
       energyItem.height = 85;
       energyItem.top = ((this.mainHeight / 2) - posy);
       energyItem.left = ((this.mainHeight/ 2 ) + posx);

       var energyConfig: DonutConfig =  {
        left: energyItem.left,
        top: energyItem.top,
        width: energyItem.width,
        height: energyItem.height
       };

       this.energyService.setCssVar("--widthDonutChild", energyItem.width+'px');
       this.energyService.setCssVar("--heightDonutChild", energyItem.height+'px');

       var idElementSource = energyItem.index;
       var mainDivStyle = `position: absolute;z-index: 1;top: ${energyItem.top}px;left: ${energyItem.left}px;`;

       const viewContainerRef = this.energyHost.viewContainerRef;
       const componentRef = viewContainerRef.createComponent(DonutChartComponent);
       componentRef.instance.idElementSource = idElementSource;
       componentRef.instance.mainDivStyle = mainDivStyle;
       componentRef.instance.theta = this.theta;
       componentRef.instance.widhtDiv = this.widhtDiv;         
       componentRef.instance.energyConfig = energyConfig;         
     });      

    Promise.resolve().then(() => {
      this.generateLines();
    });     
 }
    
  generateLines() {    
    let donutControl:ElementRef = this.main.nativeElement.children[0];    

    this.energyList.forEach(sourceItem => {      
      this.connectLines(sourceItem, this.energyControlItem, 5);
    });    
  }

  connectLines(sourceItem:Energy, sourceControlItem, thickness) { 
 
    
    // position of the line in the Middle div
    var x1 = sourceItem.left + (sourceItem.width / 2);
    var y1 = sourceItem.top + (sourceItem.height / 2);
    // position of the line in the child div
    var x2 = sourceControlItem.left + (sourceControlItem.width / 2);
    var y2 = sourceControlItem.top + (sourceControlItem.height / 2);
    // distance
    var length = Math.sqrt(((x2-x1) * (x2-x1)) + ((y2-y1) * (y2-y1)));
    // center
    var cx = ((x1 + x2) / 2) - (length / 2);
    var cy = ((y1 + y2) / 2) - (thickness / 2);
    // angle
    var angle = Math.atan2((y1-y2),(x1-x2))*(180/Math.PI);
   
     //melhorar esse negocio aqui *************************
     var style = "padding:0px; margin:0px; height:" + thickness + "px; line-height:1px; position:absolute; left:" + cx + "px; top:" + cy + "px; width:" + length + "px; -moz-transform:rotate(" + angle + "deg); -webkit-transform:rotate(" + angle + "deg); -o-transform:rotate(" + angle + "deg); -ms-transform:rotate(" + angle + "deg); transform:rotate(" + angle + "deg);"
    

    const viewContainerRef = this.energyHost.viewContainerRef;
    const componentRef = viewContainerRef.createComponent(LineChildComponent);    
    componentRef.instance.style = style;
    componentRef.instance.sourceItem = sourceItem;
    componentRef.instance.length = length;
    componentRef.instance.parentDiv = true;        
  }

  resetDiv(){    
    this.theta = [];   
    const viewContainerRef = this.energyHost.viewContainerRef;
    viewContainerRef.clear();
  }

  ngOnDestroy(): void {
    this.changeEnergyList.unsubscribe();
  }

}
