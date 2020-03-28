import { TestBed } from '@angular/core/testing';

import { ValidarNavbarService } from './validar-navbar.service';

describe('ValidarNavbarService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ValidarNavbarService = TestBed.get(ValidarNavbarService);
    expect(service).toBeTruthy();
  });
});
