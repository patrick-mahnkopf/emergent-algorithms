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
    this.resetCells();
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

        for (const type in PheromoneType) {
          const newStrength =
            cell.getPheromone(PheromoneType[type]) * 1 - this.decayRate;
          cell.setPheromone(PheromoneType[type], newStrength);
        }
      }
    }
  }

  // 70% faster than iterating over all 8 neighbors for each cell
  diffusePheromones(): void {
    const newGrid = new Grid(this.demoCanvas, this.worldManager);

    for (let row = 0; row < this.height; row++) {
      for (let col = 0; col < this.width; col++) {
        const hasLeftNeighbor = col - 1 >= 0;
        const hasTopNeighbor = row - 1 >= 0;
        const hasRightNeighbor = col + 1 < this.width;
        const hasBotNeighbor = row + 1 < this.height;

        const newMid = newGrid._cells[row][col];

        if (hasRightNeighbor) {
          const newRight = newGrid._cells[row][col + 1];
          const right = this._cells[row][col + 1];
          const mid = this._cells[row][col];
          // Update this cell
          newMid.addOtherCellsPheromones(right);
          // Update right neighbor
          newRight.addOtherCellsPheromones(mid);

          if (hasTopNeighbor) {
            const topRight = this._cells[row - 1][col + 1];
            const top = this._cells[row - 1][col];
            // Update this cell
            newMid.addOtherCellsPheromones(topRight);
            // Update right neighbor
            newRight.addOtherCellsPheromones(top);
            newRight.addOtherCellsPheromones(topRight);
          }

          if (hasBotNeighbor) {
            const botRight = this._cells[row + 1][col + 1];
            const bot = this._cells[row + 1][col];
            // Update this cell
            newMid.addOtherCellsPheromones(botRight);
            // Update right neighbor
            newRight.addOtherCellsPheromones(bot);
            newRight.addOtherCellsPheromones(botRight);
          }
        }

        if (!hasLeftNeighbor && hasBotNeighbor) {
          const newBot = newGrid._cells[row + 1][col];
          const bot = this._cells[row + 1][col];
          const mid = this._cells[row][col];
          // Update this cell
          newMid.addOtherCellsPheromones(bot);
          // Update bottom neighbor
          newBot.addOtherCellsPheromones(mid);

          if (hasRightNeighbor) {
            const right = this._cells[row][col + 1];
            const botRight = this._cells[row + 1][col + 1];
            // Update bottom neighbor
            newBot.addOtherCellsPheromones(right);
            newBot.addOtherCellsPheromones(botRight);
          }
        }

        const decay = 1 - this.diffusionRate;

        for (const type in PheromoneType) {
          let strength =
            this._cells[row][col].getPheromone(PheromoneType[type]) * decay;
          strength +=
            (newGrid._cells[row][col].getPheromone(PheromoneType[type]) *
              this.diffusionRate) /
            8;
          newGrid._cells[row][col].setPheromone(
            PheromoneType[type],
            strength < 0.05 ? 0 : strength
          );
        }
      }
    }

    this.overwriteCells(newGrid._cells);
  }

  drawPheromones(): void {
    this.canvas.clear();

    for (let row = 0; row < this.height; row++) {
      for (let col = 0; col < this.width; col++) {
        this.drawPheromone(
          row,
          col,
          0x00ff00,
          this._cells[row][col].getPheromone(PheromoneType.Nest)
        );
        this.drawPheromone(
          row,
          col,
          0x0000ff,
          this._cells[row][col].getPheromone(PheromoneType.Food)
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

  getFrontalCells(curCell: Cell, heading: number): Cell[] {
    const frontalCells: Cell[] = [];
    const cells: Cell[][] = this.cells;
    const row = curCell.row;
    const col = curCell.col;

    const hasTop = row - 1 >= 0;
    const hasBot = row + 1 < this.height;
    const hasLeft = col - 1 >= 0;
    const hasRight = col + 1 < this.width;

    switch (heading) {
      // Right
      case 0:
        if (!hasTop || !hasBot || !hasRight) return;
        frontalCells.push(cells[row - 1][col + 1]);
        frontalCells.push(cells[row][col + 1]);
        frontalCells.push(cells[row + 1][col + 1]);
        break;
      // Top right
      case 45:
        if (!hasTop || !hasRight) return;
        frontalCells.push(cells[row - 1][col]);
        frontalCells.push(cells[row - 1][col + 1]);
        frontalCells.push(cells[row][col + 1]);
        break;
      // Top
      case 90:
        if (!hasTop || !hasLeft || !hasRight) return;
        frontalCells.push(cells[row - 1][col - 1]);
        frontalCells.push(cells[row - 1][col]);
        frontalCells.push(cells[row - 1][col + 1]);
        break;
      // Top left
      case 135:
        if (!hasTop || !hasLeft) return;
        frontalCells.push(cells[row][col - 1]);
        frontalCells.push(cells[row - 1][col - 1]);
        frontalCells.push(cells[row - 1][col]);
        break;
      // Left
      case 180:
        if (!hasTop || !hasBot || !hasLeft) return;
        frontalCells.push(cells[row + 1][col - 1]);
        frontalCells.push(cells[row][col - 1]);
        frontalCells.push(cells[row - 1][col - 1]);
        break;
      // Bottom left
      case 225:
        if (!hasBot || !hasLeft) return;
        frontalCells.push(cells[row + 1][col]);
        frontalCells.push(cells[row + 1][col - 1]);
        frontalCells.push(cells[row][col - 1]);
        break;
      // Bottom
      case 270:
        if (!hasBot || !hasLeft || !hasRight) return;
        frontalCells.push(cells[row + 1][col + 1]);
        frontalCells.push(cells[row + 1][col]);
        frontalCells.push(cells[row + 1][col - 1]);
        break;
      // Bottom right
      case 315:
        if (!hasBot || !hasRight) return;
        frontalCells.push(cells[row][col + 1]);
        frontalCells.push(cells[row + 1][col + 1]);
        frontalCells.push(cells[row + 1][col]);
        break;

      default:
        break;
    }

    return frontalCells;
  }

  getNeighborCells(curCell: Cell): Cell[] {
    const neighborCells: Cell[] = [];

    for (let dRow = -1; dRow <= 1; dRow++) {
      for (let dCol = -1; dCol <= 1; dCol++) {
        const row = curCell.row + dRow;
        const col = curCell.col + dCol;
        if (
          row < 0 ||
          row >= this.height ||
          col < 0 ||
          col >= this.width ||
          (dRow == 0 && dCol == 0)
        )
          continue;
        neighborCells.push(this.worldManager.grid.cells[row][col]);
      }
    }

    return neighborCells;
  }
}

export enum PheromoneType {
  Food = 'Food',
  Nest = 'Nest',
}

export class Cell {
  // private pheromones = [0, 0];
  private pheromones: Map<PheromoneType, number> = new Map<
    PheromoneType,
    number
  >([
    [PheromoneType.Food, 0],
    [PheromoneType.Nest, 0],
  ]);
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

  getPheromone(type: PheromoneType) {
    return this.pheromones.get(type);
  }

  setPheromone(type: PheromoneType, strength: number) {
    this.pheromones.set(type, strength);
  }

  addPheromone(type: PheromoneType, strength: number) {
    this.pheromones.set(type, this.pheromones.get(type) + strength);
  }

  addOtherCellsPheromones(otherCell: Cell): void {
    for (const type in PheromoneType)
      this.addPheromone(
        PheromoneType[type],
        otherCell.getPheromone(PheromoneType[type])
      );
  }
}
