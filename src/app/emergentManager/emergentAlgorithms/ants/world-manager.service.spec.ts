import { TestBed } from '@angular/core/testing';

import { WorldManagerService } from './world-manager.service';

describe('WorldManagerService', () => {
  let service: WorldManagerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WorldManagerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
