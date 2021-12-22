import { DEG_TO_RAD } from 'pixi.js';
import { Utilities } from 'src/app/Utilities';
import { SpriteObject } from '../SpriteObject';
import { Vector2D } from '../Vector2D';
import { Cell } from './Grid';
import { WorldManagerService } from './world-manager.service';

export class Ant extends SpriteObject {
  private worldManager: WorldManagerService;

  private desiredDirection!: Vector2D;

  private hasFood = false;
  private timeSincePheromoneDrop = 0;
  private readonly dropPheromoneDelay = 125;

  private readonly maxPheromone = 10000;
  private readonly pheromoneConsumption = 0.02;
  private pheromoneReserve = this.maxPheromone;

  creationTime!: DOMHighResTimeStamp;

  constructor(texture: PIXI.Texture[], worldManager: WorldManagerService) {
    super(texture);

    this.width = 48;
    this.height = 48;
    this.anchor.set(0.5, 0.5);

    this.worldManager = worldManager;

    this.init();
  }

  init(): void {
    this.initPosition();
    this.initAngle();
    this.initVelocity();

    this.hasFood = false;

    this.desiredDirection = this.velocity;
  }

  initPosition(): void {
    const nest = this.worldManager.nest;

    this.setPosition(
      new Vector2D(
        Utilities.getRandomIntInclusive(
          nest.x - nest.radius + this.width / 2,
          nest.x + nest.radius - this.width / 2
        ),
        Utilities.getRandomIntInclusive(
          nest.y - nest.radius + this.height / 2,
          nest.y + nest.radius - this.height / 2
        )
      )
    );
  }

  initAngle(): void {
    this.setAngle(Utilities.getRandomIntInclusive(0, 360));
  }

  initVelocity(): void {
    const angle = this.getAngle() * DEG_TO_RAD;
    const x = Math.cos(angle) * this.maxSpeed;
    const y = Math.sin(angle) * this.maxSpeed;
    this.velocity = new Vector2D(x, y);
  }

  dropPheromones(deltaTime: number): void {
    if (!this.hasFood && this.worldManager.isOnFood(this.getPosition())) {
      this.hasFood = true;
      this.pheromoneReserve = this.maxPheromone;
    }
    if (this.hasFood && this.worldManager.isOnNest(this.getPosition())) {
      this.hasFood = false;
      this.pheromoneReserve = this.maxPheromone;
    }

    this.timeSincePheromoneDrop += deltaTime;

    if (this.timeSincePheromoneDrop >= this.dropPheromoneDelay) {
      this.timeSincePheromoneDrop = 0;

      if (this.hasFood) {
        this.dropFoodPheromone();
      } else {
        this.dropNestPheromone();
      }
    }
  }

  dropFoodPheromone(): void {
    const gridCell = this.worldManager.grid.getCell(this.getPosition());
    let amount;

    // Drop the maximum pheromone amount if on a food source
    if (this.worldManager.isOnFood(this.getPosition()))
      amount = this.worldManager.grid.pheromoneMax;
    // Otherwise top up the current cell to 98% of its highest neighbor's amount
    else {
      const neighborCells = this.getNeighborCells();
      let maxPheromone = 0;
      neighborCells.forEach((cell) => {
        if (maxPheromone == null || cell.foodPheromone > maxPheromone) {
          maxPheromone = cell.foodPheromone;
        }
      });

      amount = maxPheromone * 0.98 - gridCell.foodPheromone;
    }

    if (amount > 0) {
      gridCell.addFoodPheromone(amount);
    }
    // gridCell.addFoodPheromone(
    //   this.pheromoneReserve * this.pheromoneConsumption
    // );
    // this.pheromoneReserve *= 1 - this.pheromoneConsumption;
  }

  dropNestPheromone(): void {
    const gridCell = this.worldManager.grid.getCell(this.getPosition());
    let amount;

    // Drop the maximum pheromone amount if on the nest
    if (this.worldManager.isOnNest(this.getPosition()))
      amount = this.worldManager.grid.pheromoneMax;
    // Otherwise top up the current cell to 98% of its highest neighbor's amount
    else {
      const neighborCells = this.getNeighborCells();
      let maxPheromone;
      neighborCells.forEach((cell) => {
        if (maxPheromone == null || cell.nestPheromone > maxPheromone) {
          maxPheromone = cell.nestPheromone;
        }
      });

      amount = maxPheromone * 0.98 - gridCell.nestPheromone;
    }

    if (amount > 0) {
      gridCell.addNestPheromone(amount);
    }

    // gridCell.addNestPheromone(
    //   this.pheromoneReserve * this.pheromoneConsumption
    // );
    // this.pheromoneReserve *= 1 - this.pheromoneConsumption;
  }

  move(deltaTime: number): void {
    this.targetPheromones();
    this.update(deltaTime);
    this.keepWithinBounds();
    const newPosition: Vector2D = this.getPosition().addVector2D(this.velocity);
    this.setPosition(newPosition);
    this.updateAnimation(deltaTime, 2400, this.movementSpeed);
    this.setAngleFromVelocity();
    this.dropPheromones(deltaTime);
  }

  targetPheromones(): void {
    if (this.hasFood) {
      this.targetNestPheromones();
    } else {
      this.targetFoodPheromones();
    }
  }

  getFrontalCells(): Cell[] {
    const curCell = this.worldManager.grid.getCell(this.getPosition());
    const heading = this.getClosestHeading();
    const frontalCells: Cell[] = [];
    const cells: Cell[][] = this.worldManager.grid.cells;
    const width = this.worldManager.grid.width;
    const height = this.worldManager.grid.height;
    const row = curCell.row;
    const col = curCell.col;

    switch (heading) {
      case 0:
        if (row - 1 < 0 || row + 1 >= height || col + 1 >= width) return;
        frontalCells.push(cells[row - 1][col + 1]);
        frontalCells.push(cells[row][col + 1]);
        frontalCells.push(cells[row + 1][col + 1]);
        break;
      case 45:
        if (row - 1 < 0 || col + 1 >= width) return;
        frontalCells.push(cells[row - 1][col]);
        frontalCells.push(cells[row - 1][col + 1]);
        frontalCells.push(cells[row][col + 1]);
        break;
      case 90:
        if (row - 1 < 0 || col - 1 < 0 || col + 1 >= width) return;
        frontalCells.push(cells[row - 1][col - 1]);
        frontalCells.push(cells[row - 1][col]);
        frontalCells.push(cells[row - 1][col + 1]);
        break;
      case 135:
        if (row - 1 < 0 || col - 1 < 0) return;
        frontalCells.push(cells[row][col - 1]);
        frontalCells.push(cells[row - 1][col - 1]);
        frontalCells.push(cells[row - 1][col]);
        break;
      case 180:
        if (row - 1 < 0 || row + 1 >= height || col - 1 < 0) return;
        frontalCells.push(cells[row + 1][col - 1]);
        frontalCells.push(cells[row][col - 1]);
        frontalCells.push(cells[row - 1][col - 1]);
        break;
      case 225:
        if (row + 1 >= height || col - 1 < 0) return;
        frontalCells.push(cells[row + 1][col]);
        frontalCells.push(cells[row + 1][col - 1]);
        frontalCells.push(cells[row][col - 1]);
        break;
      case 270:
        if (row + 1 >= height || col - 1 < 0 || col + 1 >= width) return;
        frontalCells.push(cells[row + 1][col + 1]);
        frontalCells.push(cells[row + 1][col]);
        frontalCells.push(cells[row + 1][col - 1]);
        break;
      case 315:
        if (row + 1 >= height || col + 1 >= width) return;
        frontalCells.push(cells[row][col + 1]);
        frontalCells.push(cells[row + 1][col + 1]);
        frontalCells.push(cells[row + 1][col]);
        break;

      default:
        break;
    }

    return frontalCells;
  }

  getClosestHeading(): number {
    const angle = this.getAngle();
    let closestHeading = 0;

    for (let heading = 0; heading < 360; heading += 45)
      if (Math.abs(heading - angle) <= Math.abs(closestHeading - angle))
        closestHeading = heading;

    return closestHeading;
  }

  getNeighborCells(): Cell[] {
    const curCell = this.worldManager.grid.getCell(this.getPosition());
    const width = this.worldManager.grid.width;
    const height = this.worldManager.grid.height;
    const neighborCells: Cell[] = [];

    for (let dRow = -1; dRow <= 1; dRow++) {
      for (let dCol = -1; dCol <= 1; dCol++) {
        const row = curCell.row + dRow;
        const col = curCell.col + dCol;
        if (
          row < 0 ||
          row >= height ||
          col < 0 ||
          col >= width ||
          (dRow == 0 && dCol == 0)
        )
          continue;
        neighborCells.push(this.worldManager.grid.cells[row][col]);
      }
    }

    return neighborCells;
  }

  targetFoodPheromones(): void {
    let bestCell: Cell = null;

    if (!this.worldManager.isOnNest(this.getPosition())) {
      const frontalCells = this.getFrontalCells();

      if (frontalCells != null) {
        frontalCells.forEach((cell) => {
          if (bestCell == null || cell.foodPheromone > bestCell.foodPheromone) {
            bestCell = cell;
          }
        });
      }
    }

    if (bestCell == null) {
      const neighborCells = this.getNeighborCells();
      neighborCells.forEach((cell) => {
        if (bestCell == null || cell.foodPheromone > bestCell.foodPheromone) {
          bestCell = cell;
        }
      });
    }

    if (bestCell != null && bestCell.foodPheromone > 0) {
      this.desiredDirection = bestCell.position.subtractVector2D(
        this.getPosition()
      );
    }
  }

  targetNestPheromones(): void {
    let bestCell: Cell = null;

    if (!this.worldManager.isOnFood(this.getPosition())) {
      const frontalCells = this.getFrontalCells();

      if (frontalCells != null) {
        frontalCells.forEach((cell) => {
          if (bestCell == null || cell.nestPheromone > bestCell.nestPheromone) {
            bestCell = cell;
          }
        });
      }
    }

    if (bestCell == null) {
      const neighborCells = this.getNeighborCells();
      neighborCells.forEach((cell) => {
        if (bestCell == null || cell.nestPheromone > bestCell.nestPheromone) {
          bestCell = cell;
        }
      });
    }

    if (bestCell != null && bestCell.nestPheromone > 0) {
      this.desiredDirection = bestCell.position.subtractVector2D(
        this.getPosition()
      );
    }
  }

  override update(deltaTime: number): void {
    const wanderStrength = 0.1;
    const steerStrength = 2;
    deltaTime /= 1000;

    if (!this.hasFood) {
      this.desiredDirection = this.desiredDirection.addVector2D(
        Utilities.randomInsideUnitCircle.multiplyByScalar(wanderStrength)
      ).normalized;
    }

    const desiredVelocity = this.desiredDirection.multiplyByScalar(
      this.maxSpeed
    );
    const desiredSteeringForce = desiredVelocity
      .subtractVector2D(this.velocity)
      .multiplyByScalar(steerStrength);
    const acceleration = desiredSteeringForce.clampMagnitude(steerStrength);

    this.velocity = this.velocity
      .addVector2D(acceleration.multiplyByScalar(deltaTime))
      .clampMagnitude(this.maxSpeed);
  }

  keepWithinBounds(): void {
    const MIN_BORDER_DISTANCE = 0;
    const TURN_FACTOR = this.maxSpeed;
    const antPosition = this.getPosition();

    const leftBorder: number = MIN_BORDER_DISTANCE;
    const rightBorder: number = window.innerWidth - MIN_BORDER_DISTANCE;
    const bottomBorder: number = MIN_BORDER_DISTANCE;
    const topBorder: number = window.innerHeight - MIN_BORDER_DISTANCE;

    if (antPosition.x < leftBorder) {
      this.desiredDirection.x = TURN_FACTOR;
    } else if (antPosition.x > rightBorder) {
      this.desiredDirection.x = -TURN_FACTOR;
    }

    if (antPosition.y < bottomBorder) {
      this.desiredDirection.y = TURN_FACTOR;
    } else if (antPosition.y > topBorder) {
      this.desiredDirection.y = -TURN_FACTOR;
    }
  }

  get maxSpeed(): number {
    return 1;
  }
}
