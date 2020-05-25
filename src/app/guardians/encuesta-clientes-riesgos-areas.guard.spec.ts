import { TestBed } from '@angular/core/testing';

import { EncuestaClientesRiesgosAreasGuard } from './encuesta-clientes-riesgos-areas.guard';

describe('EncuestaClientesRiesgosAreasGuard', () => {
  let guard: EncuestaClientesRiesgosAreasGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(EncuestaClientesRiesgosAreasGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
