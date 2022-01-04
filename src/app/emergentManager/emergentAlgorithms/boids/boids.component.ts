import { Component } from '@angular/core';
import { Utilities } from 'src/app/Utilities';
import { DemoCanvasService } from '../../demo/demo-canvas.service';
import { AssetManager } from '../asset-manager';
import { ISimulationComponent } from '../simulation-component-interface';
import { Bird } from './bird';
import { BoidRulesService } from './boid-rules.service';
import { BottomUiService } from './bottom-ui.service';

const loader = PIXI.Loader.shared;

@Component({
  selector: 'app-boids',
  templateUrl: './boids.component.html',
  styleUrls: ['./boids.component.scss'],
  providers: [BoidRulesService, BottomUiService],
})
export class BoidsComponent implements ISimulationComponent {
  private readonly BIRD_COUNT: number = 350;
  private birds: Bird[] = [];

  constructor(
    private demoCanvas: DemoCanvasService,
    private boidRulesService: BoidRulesService,
    private bottomUiService: BottomUiService,
    private assetManager: AssetManager
  ) {}

  init(): void {
    this.createBirds();
    this.boidRulesService.init(this.birds);
    this.bottomUiService.initSliders();
  }

  createBirds(): void {
    const sprites = this.assetManager.boidSprites;

    for (let i = 0; i < this.BIRD_COUNT; i++) {
      const index = Utilities.getRandomInt(0, sprites.length);
      const bird = new Bird(
        this.bottomUiService,
        this.demoCanvas,
        sprites[index]
      );
      this.birds.push(bird);
      this.demoCanvas.addChildToStage(bird);
    }
  }

  update(timeStamp: DOMHighResTimeStamp): void {
    this.boidRulesService.update(timeStamp);
  }

  unloadResources(): void {
    loader.reset();
  }

  onResetClicked(): void {
    this.resetBirds();
  }

  resetBirds(): void {
    this.birds.forEach((bird) => {
      bird.init();
    });
  }

  onSliderClicked(event: Event): void {
    this.bottomUiService.onSliderClicked(event);
  }

  toggleFullscreen(): void {
    this.demoCanvas.toggleFullscreen();
  }

  onTouch(event: Event): void {
    // TODO implement boids touch functionality
  }
}
