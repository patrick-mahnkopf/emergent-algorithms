import { Injectable } from '@angular/core';
import { DemoCanvasService } from '../../demo/demo-canvas.service';
import { Vector2D } from '../vector-2d';
import { Bird } from './bird';
import { BottomUiService } from './bottom-ui.service';

@Injectable({
  providedIn: 'root',
})
export class BoidRulesService {
  private birds: Bird[];
  private previousTimeStamp: DOMHighResTimeStamp;

  constructor(
    private bottomUiService: BottomUiService,
    private demoCanvas: DemoCanvasService
  ) {}

  init(birds: Bird[]): void {
    this.birds = birds;
  }

  update(timeStamp: DOMHighResTimeStamp): void {
    if (this.previousTimeStamp != null) {
      const deltaTime = timeStamp - this.previousTimeStamp;

      this.birds.forEach((bird) => {
        this.applyBoidRules(bird);
        this.applyCanvasBoundsRule(bird);

        bird.move(deltaTime);
      });
    }

    this.previousTimeStamp = timeStamp;
  }

  applyBoidRules(bird: Bird): void {
    const coherenceWeight: number = this.bottomUiService.getCoherenceWeight();
    const separationWeight: number = this.bottomUiService.getSeparationWeight();
    const alignmentWeight: number = this.bottomUiService.getAlignmentWeight();
    const birdPosition: Vector2D = bird.getPosition();
    let centerOfMass: Vector2D = new Vector2D(0, 0);
    let separationVelocity: Vector2D = new Vector2D(0, 0);
    let averageVelocity: Vector2D = new Vector2D(0, 0);
    let alignmentVelocity: Vector2D = new Vector2D(0, 0);
    let neighborCount = 0;

    this.birds.forEach((otherBird) => {
      if (bird === otherBird) return;

      const otherBirdPosition: Vector2D = otherBird.getPosition();

      if (bird.birdInVisionRange(otherBird)) {
        centerOfMass = centerOfMass.addVector2D(otherBirdPosition);
        averageVelocity = averageVelocity.addVector2D(otherBird.velocity);
        neighborCount++;
      }

      if (bird.birdTooClose(otherBird)) {
        const delta: Vector2D =
          birdPosition.subtractVector2D(otherBirdPosition);
        separationVelocity = separationVelocity.addVector2D(delta);
      }
    });

    if (neighborCount > 0) {
      centerOfMass = centerOfMass.divideByScalar(neighborCount);

      averageVelocity = averageVelocity.divideByScalar(neighborCount);
      alignmentVelocity = averageVelocity.subtractVector2D(bird.velocity);
      alignmentVelocity = alignmentVelocity.multiplyByScalar(alignmentWeight);
    } else {
      centerOfMass = birdPosition;
    }

    const centerVelocity: Vector2D =
      centerOfMass.subtractVector2D(birdPosition);
    const coherenceVelocity: Vector2D =
      centerVelocity.multiplyByScalar(coherenceWeight);

    separationVelocity = separationVelocity.multiplyByScalar(separationWeight);

    bird.addVelocity(coherenceVelocity);
    bird.addVelocity(separationVelocity);
    bird.addVelocity(alignmentVelocity);
  }

  applyCanvasBoundsRule(bird: Bird): void {
    const MIN_BORDER_DISTANCE = 0;
    const TURN_FACTOR = bird.movementSpeed;
    const currentBirdPosition = bird.getPosition();

    const leftBorder: number = MIN_BORDER_DISTANCE;
    const rightBorder: number = this.demoCanvas.width - MIN_BORDER_DISTANCE;
    const bottomBorder: number = MIN_BORDER_DISTANCE;
    const topBorder: number = this.demoCanvas.height - MIN_BORDER_DISTANCE;

    if (currentBirdPosition.x < leftBorder) {
      bird.addVelocity(new Vector2D(TURN_FACTOR, 0));
    } else if (currentBirdPosition.x > rightBorder) {
      bird.addVelocity(new Vector2D(-TURN_FACTOR, 0));
    }

    if (currentBirdPosition.y < bottomBorder) {
      bird.addVelocity(new Vector2D(0, TURN_FACTOR));
    } else if (currentBirdPosition.y > topBorder) {
      bird.addVelocity(new Vector2D(0, -TURN_FACTOR));
    }
  }
}
