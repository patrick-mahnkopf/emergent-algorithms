import { Graphics } from 'pixi.js';
import { DemoCanvasService } from '../../demo/demo-canvas.service';
import { Vector2D } from '../vector-2d';
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
    this.initCells();
  }

  init(): void {
    window.addEventListener('resize', () => {
      this.onResize();
    });
  }

  onResize(): void {
    setTimeout(() => this.resizeGrid(), 10);
  }

  resizeGrid(): void {
    const cells: Cell[][] = [];
    const prevHeight = this._cells.length;
    const prevWidth = this._cells[0].length;

    for (let row = 0; row < this.height; row++) {
      cells[row] = [];
      for (let col = 0; col < this.width; col++) {
        // Copy old cells within old bounds
        if (row < prevHeight && col < prevWidth) {
          cells[row][col] = this._cells[row][col];
        }
        // Create new cells outside of old bounds
        else {
          const pos = this.getCellPosition(row, col);
          cells[row][col] = new Cell(row, col, pos);
        }
      }
    }

    this.overwriteCells(cells);
  }

  reset(): void {
    this.initCells();
    this.canvas.clear();
  }

  initCells(): void {
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
    const gridHeight = this.cells.length;
    const gridWidth = this.cells[0].length;

    for (let row = 0; row < gridHeight; row++) {
      for (let col = 0; col < gridWidth; col++) {
        const cell = this.cells[row][col];

        if (
          this.worldManager.isOnFood(cell.position) ||
          this.worldManager.isOnNest(cell.position)
        )
          continue;

        for (const type in PheromoneType) {
          const newStrength =
            this.cells[row][col].getPheromone(PheromoneType[type]) *
            (1 - this.decayRate);
          this.cells[row][col].setPheromone(PheromoneType[type], newStrength);
        }
      }
    }
  }

  // 70% faster than iterating over all 8 neighbors for each cell
  diffusePheromones(): void {
    const oldCells = this.cells;
    const newGrid = new Grid(this.demoCanvas, this.worldManager);

    const gridHeight = Math.min(oldCells.length, newGrid.cells.length);
    const gridWidth = Math.min(oldCells[0].length, newGrid.cells[0].length);

    for (let row = 0; row < gridHeight; row++) {
      for (let col = 0; col < gridWidth; col++) {
        const hasLeftNeighbor = col - 1 >= 0;
        const hasTopNeighbor = row - 1 >= 0;
        const hasRightNeighbor = col + 1 < gridWidth;
        const hasBotNeighbor = row + 1 < gridHeight;

        const newMid = newGrid._cells[row][col];

        if (hasRightNeighbor) {
          const newRight = newGrid._cells[row][col + 1];
          const right = oldCells[row][col + 1];
          const mid = oldCells[row][col];
          // Update this cell
          newMid.addOtherCellsPheromones(right);
          // Update right neighbor
          newRight.addOtherCellsPheromones(mid);

          if (hasTopNeighbor) {
            const topRight = oldCells[row - 1][col + 1];
            const top = oldCells[row - 1][col];
            // Update this cell
            newMid.addOtherCellsPheromones(topRight);
            // Update right neighbor
            newRight.addOtherCellsPheromones(top);
            newRight.addOtherCellsPheromones(topRight);
          }

          if (hasBotNeighbor) {
            const botRight = oldCells[row + 1][col + 1];
            const bot = oldCells[row + 1][col];
            // Update this cell
            newMid.addOtherCellsPheromones(botRight);
            // Update right neighbor
            newRight.addOtherCellsPheromones(bot);
            newRight.addOtherCellsPheromones(botRight);
          }
        }

        if (!hasLeftNeighbor && hasBotNeighbor) {
          const newBot = newGrid._cells[row + 1][col];
          const bot = oldCells[row + 1][col];
          const mid = oldCells[row][col];
          // Update this cell
          newMid.addOtherCellsPheromones(bot);
          // Update bottom neighbor
          newBot.addOtherCellsPheromones(mid);

          if (hasRightNeighbor) {
            const right = oldCells[row][col + 1];
            const botRight = oldCells[row + 1][col + 1];
            // Update bottom neighbor
            newBot.addOtherCellsPheromones(right);
            newBot.addOtherCellsPheromones(botRight);
          }
        }

        const decay = 1 - this.diffusionRate;

        for (const type in PheromoneType) {
          let strength =
            oldCells[row][col].getPheromone(PheromoneType[type]) * decay;
          strength +=
            (newGrid._cells[row][col].getPheromone(PheromoneType[type]) *
              this.diffusionRate) /
            8;
          newGrid._cells[row][col].setPheromone(PheromoneType[type], strength);
        }
      }
    }

    this.overwriteCells(newGrid._cells);
  }

  drawPheromones(): void {
    const gridHeight = this.cells.length;
    const gridWidth = this.cells[0].length;

    this.canvas.clear();

    for (let row = 0; row < gridHeight; row++) {
      for (let col = 0; col < gridWidth; col++) {
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

    const gridHeight = this.cells.length;
    const gridWidth = this.cells[0].length;

    const hasTop = row - 1 >= 0;
    const hasBot = row + 1 < gridHeight;
    const hasLeft = col - 1 >= 0;
    const hasRight = col + 1 < gridWidth;

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
    if (strength < 0.05) this.pheromones.set(type, 0);
    else this.pheromones.set(type, strength);
  }

  addPheromone(type: PheromoneType, strength: number) {
    this.setPheromone(type, this.pheromones.get(type) + strength);
  }

  addOtherCellsPheromones(otherCell: Cell): void {
    for (const type in PheromoneType)
      this.addPheromone(
        PheromoneType[type],
        otherCell.getPheromone(PheromoneType[type])
      );
  }
}
