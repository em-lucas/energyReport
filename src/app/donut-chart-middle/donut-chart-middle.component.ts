import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-donut-chart-middle',
  templateUrl: './donut-chart-middle.component.html',
  styleUrls: ['./donut-chart-middle.component.scss']
})
export class DonutChartMiddleComponent implements OnInit {

  @Input() style;
  
  constructor() { }

  ngOnInit(): void {
  }

}
