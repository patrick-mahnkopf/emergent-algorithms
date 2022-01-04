import { Component, ElementRef, ViewContainerRef } from '@angular/core';
import { DemoCanvasService } from './demo-canvas.service';
import { IDemoComponent } from './demo-component-interface';
import { DemoService } from './demo.service';

@Component({
  selector: 'app-demo',
  templateUrl: './demo.component.html',
  styleUrls: ['./demo.component.scss'],
})
export class DemoComponent implements IDemoComponent {
  private demoContainer: ViewContainerRef;

  constructor(
    private demoService: DemoService,
    private demoCanvas: DemoCanvasService
  ) {}

  init(pixiContainer: ElementRef, demoContainer: ViewContainerRef): void {
    this.demoContainer = demoContainer;
    this.demoCanvas.init(pixiContainer, this);

    this.demoCanvas.loadResources();
  }

  onLoadFinished(): void {
    this.demoService.init(this.demoContainer);
  }

  activateDemo(componentName: string): void {
    this.demoService.activateDemo(componentName);
  }

  onDestroy(): void {
    this.demoService.stopDemo();
    this.demoCanvas.unloadResources();
  }
}
