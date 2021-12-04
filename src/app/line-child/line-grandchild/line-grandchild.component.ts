import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-line-grandchild',
  templateUrl: './line-grandchild.component.html',
  styleUrls: ['./line-grandchild.component.scss']
})
export class LineGrandchildComponent implements OnInit {

  @Input() id;
  @Input() class;
  @Input() listStyle: string[];

  constructor() { }

  ngOnInit(): void {
  }

}
