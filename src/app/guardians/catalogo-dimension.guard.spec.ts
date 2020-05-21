import { TestBed } from '@angular/core/testing';

import { CatalogoDimensionGuard } from './catalogo-dimension.guard';

describe('CatalogoDimensionGuard', () => {
  let guard: CatalogoDimensionGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(CatalogoDimensionGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
