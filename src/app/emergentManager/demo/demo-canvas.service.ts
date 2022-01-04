import { ElementRef, Injectable } from '@angular/core';
import screenfull from 'screenfull';
import { Utilities } from 'src/app/Utilities';
import { AssetManager } from '../emergentAlgorithms/asset-manager';
import { DemoComponent } from './demo.component';

const Application = PIXI.Application;

@Injectable({
  providedIn: 'root',
})
export class DemoCanvasService {
  private demo: DemoComponent;

  app: PIXI.Application;
  private pixiContainer: ElementRef;

  private fpsTextStyle = new PIXI.TextStyle({
    fontFamily: 'Arial',
    fontSize: 16,
    fill: '#d1821c',
  });
  private fpsText = new PIXI.Text('FPS: ', this.fpsTextStyle);

  constructor(private assetManager: AssetManager) {}

  init(pixiContainer: ElementRef, demo: DemoComponent): void {
    this.pixiContainer = pixiContainer;
    this.demo = demo;

    const backgroundColor = Utilities.convertRgbToHex(
      window
        .getComputedStyle(pixiContainer.nativeElement)
        .getPropertyValue('background-color')
    );

    this.app = new Application({
      antialias: true,
      backgroundColor: backgroundColor,
      resolution: window.devicePixelRatio,
      resizeTo: window,
    });

    // Enable touch scrolling
    this.app.renderer.plugins.interaction.autoPreventDefault = false;
    this.app.renderer.view.style.touchAction = 'auto';

    this.app.view.style.width = '100vw';
    this.app.view.style.height = '100vh';

    this.pixiContainer.nativeElement.appendChild(this.app.view);
    this.fpsText.position.set(8, 8);
  }

  loadResources(): void {
    this.assetManager.loadAssets(this.demo.onLoadFinished.bind(this.demo));
  }

  unloadResources(): void {
    this.assetManager.unloadAssets();
  }

  addChildToStage(pixiChildObject: PIXI.DisplayObject): void {
    this.app.stage.addChild(pixiChildObject);
  }

  removeChildFromStage(pixiChildObject: PIXI.DisplayObject): void {
    this.app.stage.removeChild(pixiChildObject);
  }

  addFpsCounterToStage(): void {
    this.addChildToStage(this.fpsText);
  }

  removeAllChildrenFromStage(): void {
    this.app.stage.removeChildren();
  }

  onFpsUpdate(fps: number): void {
    this.fpsText.text = `FPS: ${fps}`;
  }

  get width(): number {
    return this.app.screen.width;
  }

  get height(): number {
    return this.app.screen.height;
  }

  // Removes fullscreen toggle on devices that don't support it and centers remaining elements
  checkFullscreenSupported(): void {
    if (!this.fullscreenSupported()) {
      // Hide fullscreen toggle buttons
      const fullscreenToggles = document.getElementsByClassName(
        'fullscreen-toggle'
      ) as HTMLCollectionOf<HTMLDivElement>;

      for (const toggle of fullscreenToggles) {
        toggle.style.display = 'none';
      }

      // Center remaining elements
      document
        .getElementById('bottom-buttons')
        .classList.replace('justify-between', 'justify-center');
    }
  }

  fullscreenSupported(): boolean {
    const simulation = document.getElementById('simulation');

    return (
      screenfull.isEnabled &&
      !Utilities.isIpad() &&
      (simulation.requestFullscreen != undefined ||
        simulation.mozRequestFullscreen != undefined ||
        simulation.webkitRequestFullscreen != undefined ||
        simulation.msRequestFullscreen != undefined)
    );
  }

  toggleFullscreen(): void {
    if (!screenfull.isEnabled)
      if (Utilities.isIpad())
        alert(
          'Your browser does not support fullscreen for non-video elements. On iPadOS, this is only supported by Safari.'
        );
      else
        alert(
          'Your browser does not support fullscreen for non-video elements. Please try a different browser or device.'
        );

    const simulation = document.getElementById('simulation');

    if (screenfull.isEnabled)
      screenfull.toggle(simulation, { navigationUI: 'hide' });
  }
}
