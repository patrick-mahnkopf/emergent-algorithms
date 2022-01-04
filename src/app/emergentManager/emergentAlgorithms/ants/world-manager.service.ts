import { Injectable } from '@angular/core';
import { DemoCanvasService } from '../../demo/demo-canvas.service';
import { Circle } from '../circle';
import { Vector2D } from '../vector-2d';
import { Grid } from './grid';

@Injectable({
  providedIn: 'root',
})
export class WorldManagerService {
  nest: Circle;
  food: Circle;
  grid: Grid;

  private timeSincePheromoneUpdate = 0;
  private diffusePheromonesDelay = 250;

  private previousUpdateTimeStamp: number;

  constructor(private demoCanvas: DemoCanvasService) {}

  init(): void {
    this.initGrid();

    const size = Math.min(this.demoCanvas.width, this.demoCanvas.height);
    const dist = size * 0.2;
    const radius = size * 0.1;

    this.initNest(dist, dist, radius);
    this.initFood(
      this.demoCanvas.width - dist,
      this.demoCanvas.height - dist,
      radius
    );
  }

  initGrid(): void {
    this.grid = new Grid(this.demoCanvas, this);
    this.grid.addToCanvas();
  }

  initNest(x: number, y: number, radius: number): void {
    this.nest = new Circle(x, y, radius, 0x00cc00);
    this.demoCanvas.addChildToStage(this.nest);
  }

  initFood(x: number, y: number, radius: number): void {
    this.food = new Circle(x, y, radius, 0x0000cc);
    this.demoCanvas.addChildToStage(this.food);
  }

  update(timeStamp: DOMHighResTimeStamp): void {
    if (this.previousUpdateTimeStamp == null) {
      this.previousUpdateTimeStamp = timeStamp;
      return;
    }

    const deltaTime = timeStamp - this.previousUpdateTimeStamp;
    this.timeSincePheromoneUpdate += deltaTime;

    if (this.timeSincePheromoneUpdate >= this.diffusePheromonesDelay) {
      this.timeSincePheromoneUpdate = 0;
      this.grid.decayPheromones();
      this.grid.diffusePheromones();
      this.grid.drawPheromones();
    }
  }

  isOnFood(antPosition: Vector2D): boolean {
    return this.food.containsVector2D(antPosition);
  }

  isOnNest(antPosition: Vector2D): boolean {
    return this.nest.containsVector2D(antPosition);
  }

  onSliderClicked(event: Event): void {
    const target = event.target as HTMLInputElement;
    const sliderName = target.id;
    const weightModifier = +target.value / 100;

    switch (sliderName) {
      case 'decay-slider':
        this.grid.decayRate = this.grid.DEFAULT_DECAY_RATE * 2 * weightModifier;
        if (this.grid.decayRate > 1) this.grid.decayRate = 1;
        break;
      case 'diffusion-slider':
        this.grid.diffusionRate =
          this.grid.DEFAULT_DIFFUSION_RATE * 2 * weightModifier;
        if (this.grid.diffusionRate > 1) this.grid.diffusionRate = 1;
        break;

      default:
        break;
    }
  }

  reset(): void {
    this.grid.reset();
  }
}
