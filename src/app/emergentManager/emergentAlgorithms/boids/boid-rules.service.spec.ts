import { TestBed } from '@angular/core/testing';

import { BoidRulesService } from './boid-rules.service';

describe('BoidRulesService', () => {
  let service: BoidRulesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BoidRulesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
