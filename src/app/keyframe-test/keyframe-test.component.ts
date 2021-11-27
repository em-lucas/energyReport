import { Component, HostBinding, OnInit  } from '@angular/core';

@Component({
  selector: 'app-keyframe-test',
  templateUrl: './keyframe-test.component.html',
  styleUrls: ['./keyframe-test.component.scss']
  })

export class KeyframeTestComponent implements OnInit {

  style:string;
  show:boolean = false;
  valueStrokeStart = ""
  valueStrokeEnd = ""

  ngOnInit() {
     this.valueStrokeEnd = "90, 10"
     var effectName = "donutEffectName"
     this.style = `animation:  ${effectName} 2s;`;

     var styleFrame = document.createElement('style');
     //styleFrame.type = 'text/css';
      var keyFrames = `
      @keyframes ${effectName} {
        0% {
            stroke-dasharray:  0 , 100;
        }
        100% {
            stroke-dasharray:  ${this.valueStrokeEnd};
        }
      }
      `;

    styleFrame.innerHTML = keyFrames;
    styleFrame.id = "chuchubeleza";
    document.getElementsByTagName('head')[0].appendChild(styleFrame);

   setInterval(()=> {

    var styles = document.getElementsByTagName('style');
    for (var i=0, max = styles.length; i < max; i++) {
      if(styles[i].id == "chuchubeleza"){
        styles[i].parentNode.removeChild(styles[i]);
      }
    }
      
    this.valueStrokeStart = this.valueStrokeEnd
    
    
    var startNumber = Math.floor(Math.random() * 100); // Porcentage
    var endNumber = 100 - startNumber;    
    var strokeEnd = `${startNumber} ${endNumber}`;


    //this.valueStrokeEnd = "80, 20"
    var effectName = "donutEffectName"
    this.style = "";

    var styleFrame = document.createElement('style');    
    styleFrame.id = "chuchubeleza";
    //styleFrame.type = 'text/css';
     var keyFrames = `
     @keyframes ${effectName} {
       0% {
           stroke-dasharray: ${this.valueStrokeStart};
       }
       100% {
           stroke-dasharray:  ${strokeEnd};
       }
     }
     `;

      styleFrame.innerHTML = keyFrames.replace(/A_DYNAMIC_VALUE/g, "180deg");
      document.getElementsByTagName('head')[0].appendChild(styleFrame);
     
    
      
        setTimeout(()=> {
          this.style = `animation:  ${effectName} 2s;`;
          this.valueStrokeEnd = strokeEnd;
        } ,1);
      } ,6000);




      // setInterval(()=> {
      

      //   var startNumber = Math.floor(Math.random() * 100); // Porcentage
      //   var endNumber = 100 - startNumber;    
      //   this.valueStrokeEnd = `${startNumber} ${endNumber}`;
        
      //   setAnimationTypeStrokeDasharrayStar("0, 100")
      //   setAnimationTypeStrokeDasharrayEnd(this.valueStrokeEnd);
      //   this.valueStrokeEnd = "10, 90";
      //   //this.show = !this.show;
      
      //   setTimeout(()=> {
      //     this.show = !this.show;
      //   } ,1);
      // } ,6000);
  }

  ToggleAnimation(){
    this.show = !this.show;
  }
}


