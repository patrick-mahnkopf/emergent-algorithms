import { Vector2D } from './Vector2D';

export class SpriteObject extends PIXI.AnimatedSprite {
  private frame = this.currentFrame;
  private timeSinceAnimation = 0;
  velocity: Vector2D = new Vector2D(0, 0);

  updateAnimation(
    deltaTime: number,
    targetFps: number,
    movementSpeed: number
  ): void {
    const delay = 1 / targetFps;
    deltaTime /= 1000;
    this.timeSinceAnimation += deltaTime * movementSpeed;

    if (this.timeSinceAnimation >= delay) {
      this.timeSinceAnimation = 0;
      this.nextFrame();
    }
  }

  nextFrame(): void {
    this.frame++;
    this.frame %= this.totalFrames;

    this.gotoAndStop(this.frame);
  }

  getAngle(): number {
    // Subtract angle from 90° to convert from PIXI angle
    return this.convertAngle(this.angle);
  }

  setAngle(angle: number): void {
    // Add 90° to convert to PIXI angle
    this.angle = this.convertAngle(angle);
  }

  // Converts back and forth between cartesian angle and pixi angle
  convertAngle(angle: number): number {
    angle = 90 - (angle % 360);
    if (angle < 0) angle += 360;
    return angle;
  }

  setAngleFromVelocity(): void {
    this.angle = this.velocity.angle + 90;
  }

  addVelocity(vector: Vector2D): void {
    const newVelocity: Vector2D = this.velocity.addVector2D(vector);
    this.velocity = newVelocity;
  }

  getPosition(): Vector2D {
    return new Vector2D(this.x, this.y);
  }

  setPosition(position: Vector2D): void {
    this.position.set(position.x, position.y);
  }

  get movementSpeed(): number {
    return this.velocity.magnitude;
  }
}
