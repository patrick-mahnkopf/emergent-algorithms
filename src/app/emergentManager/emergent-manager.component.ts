import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { DemoCanvasService } from './demo-canvas.service';
import { DemoService } from './demo.service';

@Component({
  selector: 'app-emergent-manager',
  templateUrl: './emergent-manager.component.html',
  styleUrls: ['./emergent-manager.component.scss'],
  providers: [],
})
export class EmergentManagerComponent implements AfterViewInit, OnDestroy {
  @ViewChild('pixi') pixiContainer: ElementRef;
  @ViewChild('demo', { read: ViewContainerRef })
  demoContainer: ViewContainerRef;
  @ViewChild('startButton') startButton: ElementRef;

  constructor(
    private demoService: DemoService,
    private demoCanvas: DemoCanvasService
  ) {}

  ngAfterViewInit(): void {
    this.demoCanvas.init(this.pixiContainer, this);
  }

  onLoadFinished(): void {
    this.demoService.init(this.demoContainer);
  }

  onDemoButtonClicked(button: HTMLButtonElement): void {
    const buttonId: string = button.id;

    if (!buttonId.includes('-button'))
      throw new Error('Malformed Emergent demo button id!');

    const componentName = buttonId.split('-')[0];

    this.demoService.activateDemo(componentName);
  }

  onStartButtonClicked(): void {
    this.demoCanvas.loadResources();
    document.getElementById('start-button-wrapper').style.display = 'none';
  }

  ngOnDestroy(): void {
    this.demoService.stopDemo();
    this.demoCanvas.unloadResources();
  }
}
