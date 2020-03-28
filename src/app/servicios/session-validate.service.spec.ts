import { TestBed } from '@angular/core/testing';

import { SessionValidateService } from './session-validate.service';

describe('SessionValidateService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SessionValidateService = TestBed.get(SessionValidateService);
    expect(service).toBeTruthy();
  });
});
