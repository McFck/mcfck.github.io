import { AfterViewInit, ComponentFactoryResolver, ComponentRef, Directive, ElementRef, HostListener, Renderer2, ViewContainerRef } from '@angular/core';
import { ImageLoadComponent } from '../components/image-load/image-load.component';

@Directive({
  selector: '[loadImage]'
})
export class LoadImageDirective {

  private loaderComponentRef: ComponentRef<ImageLoadComponent>;

  constructor(
    private el: ElementRef, 
    private renderer: Renderer2,
    private componentFactoryResolver: ComponentFactoryResolver,
    private viewContainerRef: ViewContainerRef
  ) {}

  ngOnInit(): void {
    // Create an instance of the ImageLoadComponent
    const factory = this.componentFactoryResolver.resolveComponentFactory(ImageLoadComponent);
    this.loaderComponentRef = this.viewContainerRef.createComponent(factory);

    if (this.el.nativeElement.height) {
      this.loaderComponentRef.instance.height = this.el.nativeElement.height;
    }

    if (this.el.nativeElement.width) {
      this.loaderComponentRef.instance.width = this.el.nativeElement.width;
    }

    // Insert the loader component before the image
    this.renderer.insertBefore(this.el.nativeElement.parentNode, this.loaderComponentRef.location.nativeElement, this.el.nativeElement);

    // Initially hide the image
    this.renderer.setStyle(this.el.nativeElement, 'display', 'none');
  }
  
  @HostListener('load')
  onLoad() {
    // Hide the loader component and show the image when the image is loaded
    this.loaderComponentRef.destroy();
    this.renderer.setStyle(this.el.nativeElement, 'display', 'block');
  }

}
