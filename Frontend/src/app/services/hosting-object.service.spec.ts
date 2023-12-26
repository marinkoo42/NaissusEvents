import { TestBed } from '@angular/core/testing';

import { HostingObjectService } from './hosting-object.service';

describe('HostingObjectService', () => {
  let service: HostingObjectService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HostingObjectService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
