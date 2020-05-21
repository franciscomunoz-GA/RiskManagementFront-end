import { TestBed } from '@angular/core/testing';

import { CatalogoCriterioGuard } from './catalogo-criterio.guard';

describe('CatalogoCriterioGuard', () => {
  let guard: CatalogoCriterioGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(CatalogoCriterioGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
