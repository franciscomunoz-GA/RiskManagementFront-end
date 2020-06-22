import { TestBed, async, inject } from '@angular/core/testing';

import { EncuestasGuard } from './encuestas.guard';

describe('EncuestasGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [EncuestasGuard]
    });
  });

  it('should ...', inject([EncuestasGuard], (guard: EncuestasGuard) => {
    expect(guard).toBeTruthy();
  }));
});
