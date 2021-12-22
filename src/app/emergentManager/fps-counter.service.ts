import { Injectable } from '@angular/core';
import { DemoCanvasService } from './demo-canvas.service';

@Injectable({
  providedIn: 'root',
})
export class FpsCounterService {
  private previousStartTime: number;
  private timeSinceFPSUpdate = 0;
  private fpsCounter = 0;
  private avgFPS = 0;

  constructor(private demoCanvas: DemoCanvasService) {}

  update(timeStamp: DOMHighResTimeStamp): void {
    const updateFPSTimeOut = 1;

    const secondsPassed: number = (timeStamp - this.previousStartTime) / 1000;
    this.previousStartTime = timeStamp;
    const fps: number = Math.round(1 / secondsPassed);

    if (!isNaN(secondsPassed)) {
      this.timeSinceFPSUpdate += secondsPassed;
      this.fpsCounter++;
      this.avgFPS += fps;
    }

    if (this.timeSinceFPSUpdate >= updateFPSTimeOut) {
      this.demoCanvas.onFpsUpdate(Math.round(this.avgFPS / this.fpsCounter));

      this.avgFPS = 0;
      this.fpsCounter = 0;
      this.timeSinceFPSUpdate = 0;
    }
  }
}
