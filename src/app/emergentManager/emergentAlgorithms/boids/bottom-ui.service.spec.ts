import { TestBed } from '@angular/core/testing';

import { BottomUiService } from './bottom-ui.service';

describe('BottomUiService', () => {
  let service: BottomUiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BottomUiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
