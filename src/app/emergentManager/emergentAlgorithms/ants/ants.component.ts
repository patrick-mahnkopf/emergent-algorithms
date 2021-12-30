import { Component } from '@angular/core';
import { DemoCanvasService } from '../../demo-canvas.service';
import { DemoComponent } from '../DemoComponent';
import { Vector2D } from '../Vector2D';
import { AntManagerService } from './ant-manager.service';
import { PheromoneType } from './Grid';
import { WorldManagerService } from './world-manager.service';

const loader = PIXI.Loader.shared;

@Component({
  selector: 'app-ants',
  templateUrl: './ants.component.html',
  styleUrls: ['./ants.component.scss'],
})
export class AntsComponent implements DemoComponent {
  constructor(
    private demoCanvas: DemoCanvasService,
    private worldManager: WorldManagerService,
    private antManager: AntManagerService
  ) {}

  init(): void {
    this.initWorldManager();
    this.initAntManager();
  }

  initWorldManager(): void {
    this.worldManager.init();
  }

  initAntManager(): void {
    this.antManager.createAnts();
  }

  update(timeStamp: DOMHighResTimeStamp): void {
    this.worldManager.update(timeStamp);
    this.antManager.update(timeStamp);
  }

  unloadResources(): void {
    loader.reset();
  }

  onResetClicked(): void {
    this.antManager.reset();
    this.worldManager.reset();
  }

  onSliderClicked(event: Event): void {
    this.worldManager.onSliderClicked(event);
  }

  toggleFullscreen(): void {
    this.demoCanvas.toggleFullscreen();
  }

  onTouch(event: PointerEvent): void {
    const grid = this.worldManager.grid;
    const cell = grid.getCell(new Vector2D(event.offsetX, event.offsetY));
    cell.setPheromone(PheromoneType.Food, grid.pheromoneMax);
  }
}
