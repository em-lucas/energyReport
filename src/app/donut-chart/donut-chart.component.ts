import { animate, keyframes, style, transition, trigger } from '@angular/animations';
import { DOCUMENT } from '@angular/common';
import { Component, Inject, Injectable, Input, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Energy } from '../energy.model';
import { EnergyService } from '../energy.service';

@Component({
  selector: 'app-donut-chart',
  templateUrl: './donut-chart.component.html',
  styleUrls: ['./donut-chart.component.scss'],
  
})

@Injectable({
  providedIn: 'root'
})
export class DonutChartComponent implements OnInit, OnDestroy {
  @Input() idElementSource: number;

  energyItem: Energy;
  strokeDonutColor: string = "#d9e021";
  svgSourceItem =  "/assets/image/baterry.png"; // "/assets/image/windmill.png";  
  porcentageNumber: number;  
  strokePercentual:string = "0 100";
  style: string;
  color: string;
  textDonutHideFirstTime: boolean = true;
  fadeIn: boolean = false;
  interval;

  constructor(@Inject(DOCUMENT) private document: Document, private energySercie: EnergyService, private route: ActivatedRoute) { }


  ngOnInit(): void {
    //in case to access trough the url / test
    this.route.params
      .subscribe(
        (params: Params) => {
          console.log(+params['id']);
          if(params)    
            this.energyItem = this.energySercie.getEnergyItem(+params['id']); 

        }
      )
    if(!this.energyItem)
      this.energyItem = this.energySercie.getEnergyItem(this.idElementSource);   
       
    this.configSourceElement(this.energyItem.color, this.energyItem.imagePath);

    var endNumber = 100 - this.energyItem.value;        
    this.porcentageNumber = this.energyItem.value;
    var strokeEnd = `${this.energyItem.value} ${endNumber}`;
    this.setNewValue(this.energyItem.index, "0, 100", strokeEnd ); 

    this.interval = setInterval(()=>{  
      
      this.textDonutHideFirstTime = false;
      this.fadeIn = !this.fadeIn;
        
      }, 6000);
  }

  
  configSourceElement(color:string, pathImage:string) {
    
    this.color = color;
    this.svgSourceItem = `/assets/image/${pathImage}`;
  }
  
  setNewValue(id: string, strokeStart: string, strokeEnd: string){  
    this.style = "";
    this.removeStyle(id);
    var effectName = `donutEffect${id}`
    this.setStyleKeyFrame(id, effectName, strokeStart, strokeEnd);
    

    setTimeout(() => 
    {
      this.style = `animation:  ${effectName} 2s;`;
      this.strokePercentual = strokeEnd;
    }, 1);
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
    for (var i=0, max = styles.length; i < max; i++) {
      if(styles[i].id == id){
        styles[i].parentNode.removeChild(styles[i]);
      }
    }
  }

  ngOnDestroy(): void {
    clearInterval(this.interval);
  }
}


