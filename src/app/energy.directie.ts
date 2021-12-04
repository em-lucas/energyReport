import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[energyHost]',
})
export class EnergyDirective {
  
  constructor(public viewContainerRef: ViewContainerRef) { }
}