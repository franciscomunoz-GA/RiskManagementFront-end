import { TestBed } from '@angular/core/testing';

import { CatalogoRiesgoGuard } from './catalogo-riesgo.guard';

describe('CatalogoRiesgoGuard', () => {
  let guard: CatalogoRiesgoGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(CatalogoRiesgoGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
