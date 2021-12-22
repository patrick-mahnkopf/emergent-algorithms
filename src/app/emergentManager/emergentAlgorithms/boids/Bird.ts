import { Utilities } from 'src/app/Utilities';
import { SpriteObject } from '../SpriteObject';
import { Vector2D } from '../Vector2D';
import { DemoCanvasService } from './../../demo-canvas.service';
import { BottomUiService } from './bottom-ui.service';

export class Bird extends SpriteObject {
  private bottomUiService: BottomUiService;
  private demoCanvas: DemoCanvasService;

  get maxSpeed(): number {
    return this.bottomUiService.getMaxSpeed();
  }

  get movementSpeed(): number {
    return this.maxSpeed / 8;
  }

  constructor(
    bottomUiService: BottomUiService,
    demoCanvas: DemoCanvasService,
    texture: PIXI.Texture[]
  ) {
    super(texture);

    this.bottomUiService = bottomUiService;
    this.demoCanvas = demoCanvas;

    this.width = 48;
    this.height = 48;
    this.anchor.set(0.5, 0.5);

    this.init();
  }

  init(): void {
    this.initPosition();
    this.initVelocity();
    this.initAngle();
  }

  initPosition(): void {
    const randomPosition = new Vector2D(
      Utilities.getRandomIntInclusive(
        this.width / 2,
        this.demoCanvas.width - this.width / 2
      ),
      Utilities.getRandomIntInclusive(
        this.height / 2,
        this.demoCanvas.height - this.height / 2
      )
    );

    this.setPosition(randomPosition);
  }

  initVelocity(): void {
    this.velocity = new Vector2D(
      Utilities.getRandomIntInclusive(-this.maxSpeed, this.maxSpeed),
      Utilities.getRandomIntInclusive(-this.maxSpeed, this.maxSpeed)
    );
  }

  initAngle(): void {
    this.setAngle(Utilities.getRandomIntInclusive(0, 360));
  }

  move(deltaTime: number): void {
    this.updatePosition(deltaTime);
    this.updateAnimation(deltaTime, 10, this.movementSpeed);
    this.setAngleFromVelocity();
  }

  updatePosition(deltaTime: number): void {
    const direction = this.velocity.normalized;
    const adjustedVelocity = direction
      .multiplyByScalar(this.movementSpeed)
      .multiplyByScalar(deltaTime);
    this.velocity = this.velocity
      .addVector2D(adjustedVelocity)
      .clampMagnitude(this.maxSpeed);
    const newPosition = this.getPosition().addVector2D(this.velocity);
    this.setPosition(newPosition);
  }

  birdInVisionRange(otherBird: Bird): boolean {
    const birdAPosition: Vector2D = this.getPosition();
    const birdBPosition: Vector2D = otherBird.getPosition();
    const birdDistance: number = birdAPosition.distanceTo(birdBPosition);

    return birdDistance < this.bottomUiService.getVisualRange();
  }

  birdTooClose(otherBird: Bird): boolean {
    const MIN_BIRD_DISTANCE = 20; // default 20
    return (
      this.getPosition().distanceTo(otherBird.getPosition()) < MIN_BIRD_DISTANCE
    );
  }
}
