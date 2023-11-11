import { TestBed } from '@angular/core/testing';

import { TiresService } from './tires.service';

describe('TiresService', () => {
  let service: TiresService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TiresService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
