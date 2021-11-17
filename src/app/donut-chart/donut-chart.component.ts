import { DOCUMENT } from '@angular/common';
import { Component, Inject, Injectable, Input, OnDestroy, OnInit } from '@angular/core';

@Component({
  selector: 'app-donut-chart',
  templateUrl: './donut-chart.component.html',
  styleUrls: ['./donut-chart.component.scss']
})

@Injectable({
  providedIn: 'root'
})
export class DonutChartComponent implements OnInit, OnDestroy {
  @Input() porcentageNumber: number;  // have to receive from outside
  strokePercentualStart:string = "0 100";
  strokePercentualEnd:string = "0 100";
  isAnimationDonut:boolean = false;
  svgSourceItem =  "/assets/image/baterry.png"; // "/assets/image/windmill.png";
  flipContainer: boolean = false;
  interval;

  constructor(@Inject(DOCUMENT) private document: Document) { }

  ngOnInit(): void {

    this.setCssVar("--strokeDonutColor", '#d9e021');

    this.strokePercentualEnd = "30 70";    
    this.porcentageNumber = 30;

    this.setNewValue(); 

    this.interval = setInterval(()=>{  
      //this.flipContainer = !this.flipContainer;
      var startNumber = Math.floor(Math.random() * 100); // Porcentage
      var endNumber = 100 - startNumber;

      
      this.porcentageNumber = startNumber;

      this.strokePercentualEnd = `${startNumber} ${endNumber}`;
      console.log(`${startNumber} ${endNumber}`);
       

      this.setNewValue();
        
      }, 15000);

      
    this.interval = setInterval(()=>{  
      this.flipContainer = !this.flipContainer;
        
      }, 4000);
  }
  
  setNewValue(){
    this.isAnimationDonut = true;   
    this.setCssVar("--strokePercentualStart", this.strokePercentualStart);
    this.setCssVar("--strokePercentualEnd",  this.strokePercentualEnd);
     
    this.strokePercentualStart = this.strokePercentualEnd;

    setTimeout(() => this.isAnimationDonut = false, 3000);
  }

  public setCssVar(varname: string, value: string) {
    this.document.body.style.setProperty(varname, value);
  }

  ngOnDestroy(): void {
    clearInterval(this.interval);
  }
}
