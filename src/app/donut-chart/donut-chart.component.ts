import { DOCUMENT } from '@angular/common';
import { Component, Inject, Injectable, OnDestroy, OnInit } from '@angular/core';

@Component({
  selector: 'app-donut-chart',
  templateUrl: './donut-chart.component.html',
  styleUrls: ['./donut-chart.component.scss']
})

@Injectable({
  providedIn: 'root'
})
export class DonutChartComponent implements OnInit, OnDestroy {
  strokePercentualStart:string = "0 100";
  strokePercentualEnd:string = "0 100";
  isAnimationDonut:boolean = false;
  interval;
  constructor(
    @Inject(DOCUMENT) private document: Document
) { }
  ngOnDestroy(): void {
    clearInterval(this.interval);
  }

  ngOnInit(): void {

    this.setCssVar("--strokeDonutColor", '#d9e021');

    this.strokePercentualEnd = "30 70";
    this.setNewValue(); 

    this.interval = setInterval(()=>{  
     
      var startNumber = Math.floor(Math.random() * 100);
      var endNumber = 100 - startNumber;

      this.strokePercentualEnd = `${startNumber} ${endNumber}`;
      console.log(`${startNumber} ${endNumber}`);
       

      this.setNewValue();
        
      }, 15000);
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
}
