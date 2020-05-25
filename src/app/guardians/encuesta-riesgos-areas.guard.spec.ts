import { TestBed } from '@angular/core/testing';

import { EncuestaRiesgosAreasGuard } from './encuesta-riesgos-areas.guard';

describe('EncuestaRiesgosAreasGuard', () => {
  let guard: EncuestaRiesgosAreasGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(EncuestaRiesgosAreasGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
