import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[lineHost]',
})
export class LineDirective {
  constructor(public viewContainerRef: ViewContainerRef) { }
}