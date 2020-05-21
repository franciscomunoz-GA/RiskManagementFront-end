import { TestBed } from '@angular/core/testing';

import { PermisosSeccionesService } from './permisos-secciones.service';

describe('PermisosSeccionesService', () => {
  let service: PermisosSeccionesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PermisosSeccionesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
