import { Vector2D } from './emergentManager/emergentAlgorithms/Vector2D';
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

  static showSnackBar(text: string): void {
    const snackbar = document.getElementById('snackbar')!;
    snackbar.textContent = text;
    snackbar.style.display = 'block';
    setTimeout(function () {
      snackbar.style.display = 'none';
    }, 5000);
  }
}
