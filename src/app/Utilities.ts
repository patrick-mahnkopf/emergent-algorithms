import { Vector2D } from './emergentManager/emergentAlgorithms/vector-2d';
export class Utilities {
  static getRandomInt(min: number, max: number): number {
    min = Math.ceil(min);
    max = Math.floor(max);

    return Math.floor(Math.random() * (max - min) + min);
  }

  static getRandomIntInclusive(min: number, max: number): number {
    min = Math.ceil(min);
    max = Math.floor(max);

    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  static get randomInsideUnitCircle(): Vector2D {
    const precision = 1000;
    const x =
      this.getRandomIntInclusive(-precision / 2, precision / 2) / precision;
    const y =
      this.getRandomIntInclusive(-precision / 2, precision / 2) / precision;

    return new Vector2D(x, y);
  }

  static isIpad(): boolean {
    return (
      /Macintosh/i.test(navigator.userAgent) &&
      navigator.maxTouchPoints != null &&
      navigator.maxTouchPoints > 1
    );
  }

  static isMobile(): boolean {
    return /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  }

  static convertRgbToHex(rgb: string) {
    if (!/rgb/i.test(rgb))
      throw new Error(
        "Color string has wrong format! The string should have the format: 'rgb(r, g, b)'."
      );

    const matches = /rgb\((\d.+?), (\d.+?), (\d.+?)\)/gm.exec(rgb).slice(1, 4);

    let colorString = '';
    for (const match of matches) {
      const hex = Number.parseInt(match).toString(16);
      colorString += hex.length == 1 ? '0' + hex : hex;
    }

    return Number.parseInt('0x' + colorString, 16);
  }
}
