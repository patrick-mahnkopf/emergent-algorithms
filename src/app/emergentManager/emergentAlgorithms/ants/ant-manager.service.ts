import { Injectable } from '@angular/core';
import { DemoCanvasService } from '../../demo-canvas.service';
import { AssetManager } from './../AssetManager';
import { Ant } from './Ant';
import { WorldManagerService } from './world-manager.service';

@Injectable({
  providedIn: 'root',
})
export class AntManagerService {
  private readonly ANT_COUNT: number = 100;
  private ants: Ant[] = [];

  private previousTimeStamp: DOMHighResTimeStamp;

  constructor(
    private assetManager: AssetManager,
    private demoCanvas: DemoCanvasService,
    private worldManager: WorldManagerService
  ) {}

  createAnts(): void {
    const sprite = this.assetManager.antSprite;

    this.ants = [];

    for (let i = 0; i < this.ANT_COUNT; i++) {
      const ant = new Ant(sprite, this.worldManager);
      this.ants.push(ant);
      this.demoCanvas.addChildToStage(ant);
    }
  }

  update(timeStamp: DOMHighResTimeStamp): void {
    if (this.previousTimeStamp != null) {
      const deltaTime = timeStamp - this.previousTimeStamp;

      this.ants.forEach((ant) => {
        ant.move(deltaTime);
        ant.dropPheromones(deltaTime);
      });
    }

    this.previousTimeStamp = timeStamp;
  }

  reset(): void {
    this.ants.forEach((ant) => {
      ant.init();
    });
  }
}
