import { TestBed } from '@angular/core/testing';

import { DemoCanvasService } from './demo-canvas.service';

describe('DemoCanvasService', () => {
  let service: DemoCanvasService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DemoCanvasService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
