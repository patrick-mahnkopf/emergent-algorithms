import {
  Component,
  ComponentRef,
  ElementRef,
  OnDestroy,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { IDemoComponent } from './demo/demo-component-interface';

@Component({
  selector: 'app-emergent-manager',
  templateUrl: './emergent-manager.component.html',
  styleUrls: ['./emergent-manager.component.scss'],
  providers: [],
})
export class EmergentManagerComponent implements OnDestroy {
  @ViewChild('pixi') pixiContainer: ElementRef;
  @ViewChild('demo', { read: ViewContainerRef })
  demoContainer: ViewContainerRef;
  @ViewChild('startButton') startButton: ElementRef;

  private demo: ComponentRef<IDemoComponent>;

  constructor(private viewContainerRef: ViewContainerRef) {}

  onDemoButtonClicked(button: HTMLButtonElement): void {
    const buttonId: string = button.id;

    if (!buttonId.includes('-button'))
      throw new Error('Malformed Emergent demo button id!');

    const componentName: string = buttonId.split('-')[0];

    this.demo.instance.activateDemo(componentName);
  }

  async onStartButtonClicked(): Promise<void> {
    document.getElementById('start-button-wrapper').style.display = 'none';

    const { DemoComponent } = await import('./demo/demo.component');

    this.demo = this.viewContainerRef.createComponent(DemoComponent);

    this.demo.instance.init(this.pixiContainer, this.demoContainer);
  }

  ngOnDestroy(): void {
    console.log('Manager onDestroy');
    this.demo.instance.onDestroy();
  }
}
