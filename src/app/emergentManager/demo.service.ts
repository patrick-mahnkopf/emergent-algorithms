import {
  ComponentFactory,
  ComponentFactoryResolver,
  ComponentRef,
  Injectable,
  Type,
  ViewContainerRef,
} from '@angular/core';
import { DemoCanvasService } from './demo-canvas.service';
import { AntsComponent } from './emergentAlgorithms/ants/ants.component';
import { BoidsComponent } from './emergentAlgorithms/boids/boids.component';
import { DemoComponent } from './emergentAlgorithms/DemoComponent';
import { FpsCounterService } from './fps-counter.service';

@Injectable({
  providedIn: 'root',
})
export class DemoService {
  private demoContainer: ViewContainerRef;

  private animationFrameRequestID: number;

  private readonly BOIDS_COMPONENT_NAME = 'boids';
  private readonly ANTS_COMPONENT_NAME = 'ants';

  private componentFactories = new Map<string, ComponentFactory<DemoComponent>>(
    [
      [this.BOIDS_COMPONENT_NAME, this.getFactory(BoidsComponent)],
      [this.ANTS_COMPONENT_NAME, this.getFactory(AntsComponent)],
    ]
  );

  getFactory(component: Type<DemoComponent>): ComponentFactory<DemoComponent> {
    return this.resolver.resolveComponentFactory(component);
  }

  private initialFactory: string = this.BOIDS_COMPONENT_NAME;

  activeComponent: ComponentRef<DemoComponent>;

  constructor(
    private resolver: ComponentFactoryResolver,
    private demoCanvas: DemoCanvasService,
    private fpsCounter: FpsCounterService
  ) {}

  init(demoContainer: ViewContainerRef): void {
    this.demoContainer = demoContainer;

    document
      .getElementById('demo-simulation-wrapper')
      .classList.replace('hidden', 'demo-simulation-wrapper');

    this.activateDemo(this.initialFactory);
  }

  activateDemo(componentName: string): void {
    if (!this.componentFactories.has(componentName))
      throw new Error(`No ComponentFactory named ${componentName}!`);

    if (this.activeComponent != null) {
      this.stopDemo();
    }
    this.demoContainer.clear();
    this.demoCanvas.removeAllChildrenFromStage();

    this.demoCanvas.addFpsCounterToStage();

    const demoFactory = this.componentFactories.get(componentName);
    this.activeComponent = this.demoContainer.createComponent(demoFactory);

    this.demoCanvas.app.view.addEventListener('click', (event) =>
      this.activeComponent.instance.onTouch(event)
    );

    this.startDemo();
  }

  startDemo(): void {
    const component = this.activeComponent.instance;

    component.init();
    this.initComponentUI();
    this.startSimulation();
  }

  initComponentUI(): void {
    this.initSliderColors();
    this.demoCanvas.checkFullscreenSupported();
  }

  startSimulation(): void {
    this.animationFrameRequestID = window.requestAnimationFrame(
      this.gameLoop.bind(this)
    );
  }

  gameLoop(timeStamp: DOMHighResTimeStamp): void {
    this.activeComponent.instance.update(timeStamp);

    this.fpsCounter.update(timeStamp);

    this.startSimulation();
  }

  stopDemo(): void {
    this.stopSimulation();
    if (this.activeComponent != null)
      this.activeComponent.instance.unloadResources();
  }

  stopSimulation(): void {
    window.cancelAnimationFrame(this.animationFrameRequestID);
  }

  initSliderColors(): void {
    const colorHolder = document.getElementById('color-holder');
    const trackColor = window
      .getComputedStyle(colorHolder)
      .getPropertyValue('color');
    const progressColor = window
      .getComputedStyle(colorHolder)
      .getPropertyValue('background-color');

    const sliders = document.getElementsByClassName(
      'slider'
    ) as HTMLCollectionOf<HTMLInputElement>;
    for (let i = 0; i < sliders.length; i++) {
      const slider = sliders[i];
      slider.style.background =
        'linear-gradient(to right, ' +
        progressColor +
        ' 0%, ' +
        progressColor +
        ' 50%, ' +
        trackColor +
        ' 50%, ' +
        trackColor +
        ' 100%)';

      slider.oninput = function () {
        const value =
          ((parseInt(slider.value) - parseInt(slider.min)) /
            (parseInt(slider.max) - parseInt(slider.min))) *
          100;
        slider.style.background =
          'linear-gradient(to right, ' +
          progressColor +
          ' 0%, ' +
          progressColor +
          ' ' +
          value +
          '%, ' +
          trackColor +
          ' ' +
          value +
          '%, ' +
          trackColor +
          ' 100%)';
      };
    }
  }
}
