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
  private activeAnts: Ant[] = [];

  private antLifetime = 5000;
  private simulationSteps = 0;

  private previousTimeStamp: DOMHighResTimeStamp;

  constructor(
    private assetManager: AssetManager,
    private demoCanvas: DemoCanvasService,
    private worldManager: WorldManagerService
  ) {}

  createAnts(): void {
    const sprite = this.assetManager.antSprite;

    this.ants = [];
    this.activeAnts = [];

    for (let i = 0; i < this.ANT_COUNT; i++) {
      const ant = new Ant(sprite, this.worldManager);
      this.ants.push(ant);
      this.demoCanvas.addChildToStage(ant);
    }
  }

  update(timeStamp: DOMHighResTimeStamp): void {
    if (this.previousTimeStamp != null) {
      this.updateOnly(timeStamp);
      // this.continuousCreation(timeStamp);
    }
    this.previousTimeStamp = timeStamp;
  }

  updateOnly(timeStamp: DOMHighResTimeStamp): void {
    const deltaTime = timeStamp - this.previousTimeStamp;

    this.ants.forEach((ant) => {
      ant.move(deltaTime);
      ant.dropPheromones(deltaTime);
    });
  }

  continuousCreation(timeStamp: DOMHighResTimeStamp): void {
    const deltaTime = timeStamp - this.previousTimeStamp;

    if (this.activeAnts.length <= this.ANT_COUNT - 2) {
      for (let i = 0; i < 2; i++) {
        const ant = this.ants.shift();
        ant.creationTime = this.simulationSteps;
        ant.visible = true;
        this.activeAnts.push(ant);
      }
    }

    this.activeAnts.forEach((ant) => {
      if (this.simulationSteps - ant.creationTime >= this.antLifetime) {
        ant.init();
        ant.visible = false;
        this.ants.push(this.activeAnts.shift());
      } else {
        ant.move(deltaTime);
        ant.dropPheromones(timeStamp);
      }
    });

    this.simulationSteps++;
  }

  reset(): void {
    this.ants.forEach((ant) => {
      ant.init();
    });
  }
}
