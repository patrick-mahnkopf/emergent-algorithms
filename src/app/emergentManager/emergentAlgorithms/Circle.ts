import { Vector2D } from './vector-2d';

export class Circle extends PIXI.Graphics {
  private circle: PIXI.Circle;

  constructor(x: number, y: number, radius: number, colorHex: number) {
    super();

    this.beginFill(colorHex);
    this.drawCircle(0, 0, radius);
    this.endFill();
    this.position.set(x, y);
    this.circle = new PIXI.Circle(x, y, radius);
  }

  containsVector2D(vector: Vector2D): boolean {
    return this.circle.contains(vector.x, vector.y);
  }

  getPosition(): Vector2D {
    return new Vector2D(this.x, this.y);
  }

  setPosition(position: Vector2D): void {
    this.position.set(position.x, position.y);
  }

  get radius(): number {
    return this.circle.radius;
  }

  set radius(value: number) {
    this.circle.radius = value;
  }
}

export class Rectangle extends PIXI.Graphics {
  private rectangle: PIXI.Rectangle;

  constructor(
    x: number,
    y: number,
    width: number,
    height: number,
    colorHex: number
  ) {
    super();

    this.beginFill(colorHex);
    this.drawRect(0, 0, width, height);
    this.endFill();
    this.position.set(x, y);
    this.rectangle = new PIXI.Rectangle(x, y, width, height);
  }

  containsVector2D(vector: Vector2D): boolean {
    return this.rectangle.contains(vector.x, vector.y);
  }

  getPosition(): Vector2D {
    return new Vector2D(this.x, this.y);
  }

  setPosition(position: Vector2D): void {
    this.position.set(position.x, position.y);
  }
}
