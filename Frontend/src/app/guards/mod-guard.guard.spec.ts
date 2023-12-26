import { TestBed } from '@angular/core/testing';

import { ModGuardGuard } from './mod-guard.guard';

describe('ModGuardGuard', () => {
  let guard: ModGuardGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(ModGuardGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
