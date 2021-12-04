import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[donutChildHost]',
})
export class DonutChildDirective {
  constructor(public viewContainerRef: ViewContainerRef) { }
}