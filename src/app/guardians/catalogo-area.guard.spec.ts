import { TestBed } from '@angular/core/testing';

import { CatalogoAreaGuard } from './catalogo-area.guard';

describe('CatalogoAreaGuard', () => {
  let guard: CatalogoAreaGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(CatalogoAreaGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
