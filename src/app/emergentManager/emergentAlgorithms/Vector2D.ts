import { RAD_TO_DEG } from 'pixi.js';

export class Vector2D {
  x: number;
  y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  get angle(): number {
    let theta = Math.atan2(this.y, this.x) * RAD_TO_DEG;
    if (theta < 0) theta += 360;
    return theta;
  }

  addVector2D(otherVector: Vector2D): Vector2D {
    return new Vector2D(this.x + otherVector.x, this.y + otherVector.y);
  }

  subtractVector2D(otherVector: Vector2D): Vector2D {
    return new Vector2D(this.x - otherVector.x, this.y - otherVector.y);
  }

  distanceTo(otherVector: Vector2D): number {
    const vectorDifference = this.subtractVector2D(otherVector);
    return Math.hypot(vectorDifference.x, vectorDifference.y);
  }

  multiplyByScalar(scalar: number): Vector2D {
    return new Vector2D(this.x * scalar, this.y * scalar);
  }

  dotProduct(otherVector: Vector2D): number {
    return this.x * otherVector.x + this.y * otherVector.y;
  }

  angleToVector(otherVector: Vector2D): number {
    return otherVector.angle - this.angle;
  }

  divideByScalar(scalar: number): Vector2D {
    if (scalar === 0) throw new Error('Cannot divide by 0!');

    return new Vector2D(this.x / scalar, this.y / scalar);
  }

  get magnitude(): number {
    return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
  }

  get normalized(): Vector2D {
    const magnitude = this.magnitude;

    if (magnitude > 0) {
      return this.divideByScalar(magnitude);
    }

    return this;
  }

  toString(): string {
    return 'x: ' + this.x + ', y: ' + this.y;
  }

  isEqual(other: Vector2D): boolean {
    return this.x === other.x && this.y === other.y;
  }

  clampMagnitude(maxMagnitude: number): Vector2D {
    if (this.magnitude > maxMagnitude) {
      return this.normalized.multiplyByScalar(maxMagnitude);
    } else {
      return this;
    }
  }
}
