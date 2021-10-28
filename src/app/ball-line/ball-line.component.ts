import { HttpClientModule } from '@angular/common/http';
import { AfterViewInit, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';

@Component({
  selector: 'app-ball-line',
  templateUrl: './ball-line.component.html',
  styleUrls: ['./ball-line.component.scss']
})
export class BallLineComponent implements OnInit, AfterViewInit {
  theta:number[] = [];
  circleArray:HTMLDivElement[] = [];
  numberCircle: number = 10;
  wightDiv: number = 200;
  mainHeight: number;
  @ViewChild("mainDiv") main: ElementRef;
  @ViewChild("lineDiv") line: ElementRef;
  
  constructor(private renderer: Renderer2, private http: HttpClientModule){ }

  ngOnInit(): void {    
  }

  ngAfterViewInit() {
    this.mainHeight = parseInt(window.getComputedStyle(this.main.nativeElement).height.slice(0, -2));
    this.generate();
  }

  onUpdate(){    
    this.generate(); 
  }

  onShowLine(){
      this.setLine();
  }

  setup() {
    
      let n = this.numberCircle;
      let r = this.wightDiv;
      let colors = ['red', 'green', 'purple', 'black', 'orange', 'yellow', 'maroon', 'grey', 'lightblue', 'tomato', 'pink', 'maroon', 'cyan', 'magenta', 'blue', 'chocolate', 'darkslateblue', 'coral', 'blueviolet', 'burlywood', 'cornflowerblue', 'crimson', 'darkgoldenrod', 'olive', 'sienna', 'red', 'green', 'purple', 'black', 'orange', 'yellow', 'maroon', 'grey', 'lightblue', 'tomato', 'pink', 'maroon', 'cyan', 'magenta', 'blue', 'chocolate', 'darkslateblue', 'coral', 'blueviolet', 'burlywood', 'cornflowerblue', 'crimson', 'darkgoldenrod', 'olive', 'sienna'];
      
      this.CreateGridCircle();
      
      for (var i = 0; i < n; i++) {
          var circle = this.renderer.createElement('div');
          circle.id = 'circle-number' + i;
          circle.className = 'circle number' + i;
          this.circleArray.push(circle);
          const posx = Math.round(r * (Math.cos(this.theta[i])));
          const posy = Math.round(r * (Math.sin(this.theta[i])));
          this.circleArray[i].style.position = "absolute";
          this.circleArray[i].style.backgroundColor = colors[i];
          this.circleArray[i].style.top = ((this.mainHeight / 2) - posy) + 'px';
          this.circleArray[i].style.left = ((this.mainHeight/ 2 ) + posx) + 'px';
          
          this.renderer.appendChild(this.main.nativeElement, this.circleArray[i])
      }
      //this.setLine();      
  }
  
  setLine() {
    console.log(this.main.nativeElement.children[0]);   
    
    var divMiddle = this.main.nativeElement.children[0];

    for (var i = 0; i < this.numberCircle; i++) {
      var divCircle = this.circleArray[i];
      console.log(divCircle);
      
      this.connect(divCircle, divMiddle, "#0F0", 5);
    }
  }

  connect(div1, div2, color, thickness) {
    var off1 = this.getOffset(div1);
    var off2 = this.getOffset(div2);
    // bottom right
    var x1 = off1.left + (off1.width / 2);
    var y1 = off1.top + (off1.height / 2);
    // top right
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
    htmlLine.style = "padding:0px; margin:0px; height:" + thickness + "px; background-color:" + color + "; line-height:1px; position:absolute; left:" + cx + "px; top:" + cy + "px; width:" + length + "px; -moz-transform:rotate(" + angle + "deg); -webkit-transform:rotate(" + angle + "deg); -o-transform:rotate(" + angle + "deg); -ms-transform:rotate(" + angle + "deg); transform:rotate(" + angle + "deg);"
    
    this.renderer.appendChild(this.line.nativeElement, htmlLine);
    
  }

 getOffset(el) {
    var rect = el.getBoundingClientRect();
    return {
        left: rect.left + window.pageXOffset,
        top: rect.top + window.pageYOffset,
        width: rect.width || el.offsetWidth,
        height: rect.height || el.offsetHeight
    };
  }


  //creation of the middle circle
  CreateGridCircle(){
    var circleMiddle = this.renderer.createElement('div');
    circleMiddle.id = 'circleMiddle';
    circleMiddle.className = 'circle middle';
    circleMiddle.style.position = "absolute";
    circleMiddle.style.zIndex = "1";
    circleMiddle.style.backgroundColor = 'white';
    circleMiddle.style.top = (this.mainHeight / 2)  + 'px';
    circleMiddle.style.left = (this.mainHeight/ 2 ) + 'px';
    
    this.renderer.appendChild(this.main.nativeElement, circleMiddle);
  }

  generate() {
    this.resetDiv();

    let frags = 360 / this.numberCircle;   

    for (var i = 0; i <= this.numberCircle; i++) {
        this.theta.push((frags / 180) * i * Math.PI);
    }
    this.setup()
  }

  resetDiv(){    
    this.theta = [];   
    this.circleArray = [];   

    //delete children circles
    const myEl = this.main.nativeElement;  
    while(myEl.firstChild) {
      this.renderer.removeChild(myEl, myEl.lastChild);      
    }    

    //delete children lines
    const myElLine = this.line.nativeElement;  
    while(myElLine.firstChild) {
      this.renderer.removeChild(myElLine, myElLine.lastChild);      
    }    
  }

}
