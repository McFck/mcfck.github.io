import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, Input, OnInit, TemplateRef } from '@angular/core';

@Component({
  selector: 'app-tool-tip-text',
  templateUrl: './tool-tip-text.component.html',
  styleUrls: ['./tool-tip-text.component.less']
})
export class ToolTipTextComponent implements OnInit {

  constructor(private breakpointObserver: BreakpointObserver) { }

  @Input()
  public templateMain: TemplateRef<any>;

  @Input()
  public templateTooltip: TemplateRef<any>;

  @Input()
  public textMain: string;

  @Input()
  public textTooltip: string;

  @Input()
  public placement: string = 'auto';

  mobileEvents = "click";
  desktopEvents = "hover focus";
  selectedEvents = this.desktopEvents;

  ngOnInit(): void {
    this.breakpointObserver
    .observe([Breakpoints.Handset])
    .subscribe((result) => {
      this.selectedEvents = result.matches ? this.mobileEvents : this.desktopEvents;
    });
  }

}
