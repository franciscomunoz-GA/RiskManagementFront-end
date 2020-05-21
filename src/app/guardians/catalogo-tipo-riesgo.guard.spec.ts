import { TestBed } from '@angular/core/testing';

import { CatalogoTipoRiesgoGuard } from './catalogo-tipo-riesgo.guard';

describe('CatalogoTipoRiesgoGuard', () => {
  let guard: CatalogoTipoRiesgoGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(CatalogoTipoRiesgoGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
