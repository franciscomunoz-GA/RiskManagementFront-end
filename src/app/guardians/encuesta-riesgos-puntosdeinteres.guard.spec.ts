import { TestBed } from '@angular/core/testing';

import { EncuestaRiesgosPuntosdeinteresGuard } from './encuesta-riesgos-puntosdeinteres.guard';

describe('EncuestaRiesgosPuntosdeinteresGuard', () => {
  let guard: EncuestaRiesgosPuntosdeinteresGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(EncuestaRiesgosPuntosdeinteresGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
