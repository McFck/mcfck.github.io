import { Directive, TemplateRef, ViewContainerRef, Input, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

@Directive({
  selector: '[appResponsiveTemplate]'
})
export class ResponsiveTemplateDirective implements OnInit {
  @Input('appResponsiveTemplate') hideConditions: boolean[];

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainerRef: ViewContainerRef,
    private breakpointObserver: BreakpointObserver
  ) {}

  ngOnInit() {
    this.breakpointObserver.observe([Breakpoints.Handset]).subscribe(result => {
      if (result.matches) {
        this.loadMobileTemplate();
      } else {
        this.loadDesktopTemplate();
      }
    });
  }

  private loadMobileTemplate() {
    this.viewContainerRef.clear();
    if (!this.hideConditions || !this.hideConditions[0]) {
      this.viewContainerRef.createEmbeddedView(this.templateRef);
    }
  }

  private loadDesktopTemplate() {
    this.viewContainerRef.clear();
    if (!this.hideConditions || !this.hideConditions[1]) {
      this.viewContainerRef.createEmbeddedView(this.templateRef);
    }
  }
}