import { TestBed } from '@angular/core/testing';

import { FpsCounterService } from './fps-counter.service';

describe('FpsCounterService', () => {
  let service: FpsCounterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FpsCounterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
