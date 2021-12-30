import { DEG_TO_RAD } from 'pixi.js';
import { Utilities } from 'src/app/Utilities';
import { SpriteObject } from '../SpriteObject';
import { Vector2D } from '../Vector2D';
import { Cell, PheromoneType } from './Grid';
import { WorldManagerService } from './world-manager.service';

export class Ant extends SpriteObject {
  private worldManager: WorldManagerService;

  private desiredDirection!: Vector2D;

  private hasFood = false;
  private timeSincePheromoneDrop = 0;
  private readonly dropPheromoneDelay = 125;

  private maxSpeed = 1;

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
      const isOnFood = this.worldManager.isOnFood(this.getPosition());
      this.updateTargetDirection(isOnFood, PheromoneType.Nest);
    } else {
      const isOnNest = this.worldManager.isOnNest(this.getPosition());
      this.updateTargetDirection(isOnNest, PheromoneType.Food);
    }
  }

  updateTargetDirection(
    isOnSource: boolean,
    desiredPheromoneType: PheromoneType
  ): void {
    const curCell = this.worldManager.grid.getCell(this.getPosition());
    let bestCell: Cell = null;

    if (!isOnSource) {
      const frontalCells = this.worldManager.grid.getFrontalCells(
        curCell,
        this.getClosestHeading()
      );

      if (frontalCells != null) {
        bestCell = this.getCellWithHighestPheromone(
          frontalCells,
          desiredPheromoneType
        );
      }
    }

    if (bestCell == null) {
      const neighborCells = this.worldManager.grid.getNeighborCells(curCell);

      bestCell = this.getCellWithHighestPheromone(
        neighborCells,
        desiredPheromoneType
      );
    }

    if (bestCell != null && bestCell.getPheromone(desiredPheromoneType) > 0) {
      this.desiredDirection = bestCell.position.subtractVector2D(
        this.getPosition()
      );
    }
  }

  getClosestHeading(): number {
    const angle = this.getAngle();
    let closestHeading = 0;

    for (let heading = 0; heading < 360; heading += 45)
      if (Math.abs(heading - angle) <= Math.abs(closestHeading - angle))
        closestHeading = heading;

    return closestHeading;
  }

  getCellWithHighestPheromone(cells: Cell[], type: PheromoneType): Cell {
    let bestCell;

    cells.forEach((cell) => {
      if (
        bestCell == null ||
        cell.getPheromone(PheromoneType[type]) >
          bestCell.getPheromone(PheromoneType[type])
      ) {
        bestCell = cell;
      }
    });

    return bestCell;
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

  dropPheromones(deltaTime: number): void {
    // Pick up food
    if (!this.hasFood && this.worldManager.isOnFood(this.getPosition()))
      this.hasFood = true;

    // Drop food
    if (this.hasFood && this.worldManager.isOnNest(this.getPosition()))
      this.hasFood = false;

    this.timeSincePheromoneDrop += deltaTime;

    if (this.timeSincePheromoneDrop >= this.dropPheromoneDelay) {
      this.timeSincePheromoneDrop = 0;

      if (this.hasFood) {
        const isOnFood = this.worldManager.isOnFood(this.getPosition());
        this.dropPheromone(isOnFood, PheromoneType.Food);
      } else {
        const isOnNest = this.worldManager.isOnNest(this.getPosition());
        this.dropPheromone(isOnNest, PheromoneType.Nest);
      }
    }
  }

  dropPheromone(isOnSource: boolean, pheromoneType: PheromoneType): void {
    const curCell = this.worldManager.grid.getCell(this.getPosition());
    let amount = 0;

    if (isOnSource) amount = this.worldManager.grid.pheromoneMax;
    else {
      const neighborCells = this.worldManager.grid.getNeighborCells(curCell);
      let maxPheromone = 0;

      neighborCells.forEach((cell) => {
        if (cell.getPheromone(pheromoneType) > maxPheromone)
          maxPheromone = cell.getPheromone(pheromoneType);
      });

      amount = maxPheromone * 0.98 - curCell.getPheromone(pheromoneType);
    }

    if (amount > 0) curCell.addPheromone(pheromoneType, amount);
  }
}
