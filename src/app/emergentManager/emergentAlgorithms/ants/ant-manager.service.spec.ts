import { TestBed } from '@angular/core/testing';

import { AntManagerService } from './ant-manager.service';

describe('AntManagerService', () => {
  let service: AntManagerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AntManagerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
