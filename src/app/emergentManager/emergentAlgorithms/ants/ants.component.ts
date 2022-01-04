import { Component } from '@angular/core';
import { DemoCanvasService } from '../../demo/demo-canvas.service';
import { ISimulationComponent } from '../simulation-component-interface';
import { Vector2D } from '../vector-2d';
import { AntManagerService } from './ant-manager.service';
import { PheromoneType } from './grid';
import { WorldManagerService } from './world-manager.service';

const loader = PIXI.Loader.shared;

@Component({
  selector: 'app-ants',
  templateUrl: './ants.component.html',
  styleUrls: ['./ants.component.scss'],
})
export class AntsComponent implements ISimulationComponent {
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
