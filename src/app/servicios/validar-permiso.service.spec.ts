import { TestBed } from '@angular/core/testing';

import { ValidarPermisoService } from './validar-permiso.service';

describe('ValidarPermisoService', () => {
  let service: ValidarPermisoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ValidarPermisoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
