import { ElementRef, ViewContainerRef } from '@angular/core';

export interface IDemoComponent {
  activateDemo(componentName: string): void;
  onDestroy(): void;
  init(pixiContainer: ElementRef, demoContainer: ViewContainerRef): void;
}
