import { Component, OnInit } from '@angular/core';
import interact from 'interactjs';


@Component({
  selector: 'app-draganddrop',
  templateUrl: './draganddrop.component.html',
  styleUrls: ['./draganddrop.component.scss']
})
export class DraganddropComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    const position = { x: 0, y: 0 }

    interact('.draggable').draggable({
      listeners: {
        start (event) {
          console.log(event.type, event.target)
        },
        move (event) {
          position.x += event.dx
          position.y += event.dy
    
          event.target.style.transform =
            `translate(${position.x}px, ${position.y}px)`
        },
      }
    })
  }

}
