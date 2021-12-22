import { Graphics } from 'pixi.js';
import { DemoCanvasService } from '../../demo-canvas.service';
import { Vector2D } from '../Vector2D';
import { WorldManagerService } from './world-manager.service';

export class Grid {
  private _cells: Cell[][] = [];
  private _cellLength = 16;
  private canvas: Graphics;

  pheromoneMax = 1000;

  DEFAULT_DECAY_RATE = 0.1 / 100; // 0.4
  DEFAULT_DIFFUSION_RATE = 0.2 / 100; // 0.1

  decayRate = this.DEFAULT_DECAY_RATE;
  diffusionRate = this.DEFAULT_DIFFUSION_RATE;

  constructor(
    private demoCanvas: DemoCanvasService,
    private worldManager: WorldManagerService
  ) {
    for (let row = 0; row < this.height; row++) {
      this._cells[row] = [];
      for (let col = 0; col < this.width; col++) {
        const pos = this.getCellPosition(row, col);
        this._cells[row][col] = new Cell(row, col, pos);
      }
    }
  }

  reset(): void {
    this.resetCells();
    this.canvas.clear();
  }

  resetCells(): void {
    for (let row = 0; row < this.height; row++) {
      this._cells[row] = [];
      for (let col = 0; col < this.width; col++) {
        const pos = this.getCellPosition(row, col);
        this._cells[row][col] = new Cell(row, col, pos);
      }
    }
  }

  addToCanvas(): void {
    this.canvas = new Graphics();
    this.canvas.position.set(0, 0);
    this.canvas.width = this.canvasWidth;
    this.canvas.height = this.canvasHeight;
    this.demoCanvas.addChildToStage(this.canvas);
  }

  get width(): number {
    return Math.round(this.canvasWidth / this._cellLength);
  }

  get height(): number {
    return Math.round(this.canvasHeight / this._cellLength);
  }

  get canvasWidth(): number {
    return this.demoCanvas.width;
  }

  get canvasHeight(): number {
    return this.demoCanvas.height;
  }

  get cellLength(): number {
    return this._cellLength;
  }

  get cells(): Cell[][] {
    return this._cells;
  }

  getCell(position: Vector2D): Cell {
    let col = Math.round(position.x / this._cellLength);
    if (col < 0) col = 0;
    if (col >= this.width) col = this.width - 1;

    let row = Math.round(position.y / this._cellLength);
    if (row < 0) row = 0;
    if (row >= this.height) row = this.height - 1;

    return this._cells[row][col];
  }

  getCellPosition(row: number, col: number): Vector2D {
    const x = col * this._cellLength;
    const y = row * this._cellLength;
    return new Vector2D(x, y);
  }

  overwriteCells(cells: Cell[][]): void {
    this._cells = cells;
  }

  decayPheromones(): void {
    for (let row = 0; row < this.height; row++) {
      for (let col = 0; col < this.width; col++) {
        const cell = this.cells[row][col];

        if (
          this.worldManager.isOnFood(cell.position) ||
          this.worldManager.isOnNest(cell.position)
        )
          continue;

        cell.foodPheromone *= 1 - this.decayRate;
        cell.nestPheromone *= 1 - this.decayRate;
      }
    }
  }

  // 70% faster than iterating over all 8 neighbors for each cell
  diffusePheromones(): void {
    const tempGrid = new Grid(this.demoCanvas, this.worldManager);

    for (let row = 0; row < this.height; row++) {
      for (let col = 0; col < this.width; col++) {
        const hasLeftNeighbor = col - 1 >= 0;
        const hasTopNeighbor = row - 1 >= 0;
        const hasRightNeighbor = col + 1 < this.width;
        const hasBotNeighbor = row + 1 < this.height;

        const tempCur = tempGrid._cells[row][col];

        if (hasRightNeighbor) {
          const tempRight = tempGrid._cells[row][col + 1];
          const right = this._cells[row][col + 1];
          const mid = this._cells[row][col];
          // Update this cell
          tempCur.addCellPheromones(right);
          // Update right neighbor
          tempRight.addCellPheromones(mid);

          if (hasTopNeighbor) {
            const topRight = this._cells[row - 1][col + 1];
            const top = this._cells[row - 1][col];
            // Update this cell
            tempCur.addCellPheromones(topRight);
            // Update right neighbor
            tempRight.addCellPheromones(top);
            tempRight.addCellPheromones(topRight);
          }
          if (hasBotNeighbor) {
            const botRight = this._cells[row + 1][col + 1];
            const bot = this._cells[row + 1][col];
            // Update this cell
            tempCur.addCellPheromones(botRight);
            // Update right neighbor
            tempRight.addCellPheromones(bot);
            tempRight.addCellPheromones(botRight);
          }
        }

        if (!hasLeftNeighbor) {
          if (hasBotNeighbor) {
            const tempBot = tempGrid._cells[row + 1][col];
            const bot = this._cells[row + 1][col];
            const mid = this._cells[row][col];
            // Update this cell
            tempCur.addCellPheromones(bot);
            // Update bottom neighbor
            tempBot.addCellPheromones(mid);
            if (hasRightNeighbor) {
              const right = this._cells[row][col + 1];
              const botRight = this._cells[row + 1][col + 1];
              // Update bottom neighbor
              tempBot.addCellPheromones(right);
              tempBot.addCellPheromones(botRight);
            }
          }
        }

        // const decay = (1 - this.decayRate) * (1 - this.diffusionRate);
        const decay = 1 - this.diffusionRate;

        // let nestStrength = this._cells[row][col].nestPheromone * decay;
        // nestStrength +=
        //   (tempGrid._cells[row][col].nestPheromone * this.diffusionRate) / 8;

        let nestStrength = this._cells[row][col].nestPheromone * decay;
        nestStrength +=
          (tempGrid._cells[row][col].nestPheromone * this.diffusionRate) / 8;
        tempGrid._cells[row][col].nestPheromone =
          nestStrength < 0.05 ? 0 : nestStrength;

        // let foodStrength = this._cells[row][col].foodPheromone * decay;
        // foodStrength +=
        //   (tempGrid._cells[row][col].foodPheromone * this.diffusionRate) / 8;

        let foodStrength = this._cells[row][col].foodPheromone * decay;
        foodStrength +=
          (tempGrid._cells[row][col].foodPheromone * this.diffusionRate) / 8;
        tempGrid._cells[row][col].foodPheromone =
          foodStrength < 0.05 ? 0 : foodStrength;
      }
    }

    this.overwriteCells(tempGrid._cells);
  }

  drawPheromones(): void {
    this.canvas.clear();

    for (let row = 0; row < this.height; row++) {
      for (let col = 0; col < this.width; col++) {
        this.drawPheromone(
          row,
          col,
          0x00ff00,
          this._cells[row][col].nestPheromone
        );
        this.drawPheromone(
          row,
          col,
          0x0000ff,
          this._cells[row][col].foodPheromone
        );
      }
    }
  }

  drawPheromone(
    row: number,
    col: number,
    color: number,
    strength: number
  ): void {
    if (strength == 0) return;

    strength = Math.min(strength, this.pheromoneMax);

    const alpha = (strength / this.pheromoneMax) * 0.5;

    const pos = this.getCellPosition(row, col);

    this.canvas.beginFill(color, alpha);
    this.canvas.drawRect(
      pos.x,
      pos.y,
      this._cellLength / 2,
      this._cellLength / 2
    );
    this.canvas.endFill();
  }
}

export class Cell {
  private pheromones = [0, 0];
  private _row: number;
  private _col: number;
  private _position: Vector2D;

  constructor(row: number, col: number, position: Vector2D) {
    this._row = row;
    this._col = col;
    this._position = position;
  }

  get row(): number {
    return this._row;
  }

  get col(): number {
    return this._col;
  }

  get position(): Vector2D {
    return this._position;
  }

  get nestPheromone(): number {
    return this.pheromones[0];
  }

  set nestPheromone(strength: number) {
    this.pheromones[0] = strength;
  }

  addNestPheromone(strength: number): void {
    this.pheromones[0] += strength;
  }

  get foodPheromone(): number {
    return this.pheromones[1];
  }

  set foodPheromone(strength: number) {
    this.pheromones[1] = strength;
  }

  addFoodPheromone(strength: number): void {
    this.pheromones[1] += strength;
  }

  addCellPheromones(otherCell: Cell): void {
    this.foodPheromone += otherCell.foodPheromone;
    this.nestPheromone += otherCell.nestPheromone;
  }
}
