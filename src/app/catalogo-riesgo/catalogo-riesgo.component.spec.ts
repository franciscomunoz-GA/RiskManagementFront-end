import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CatalogoRiesgoComponent } from './catalogo-riesgo.component';

describe('CatalogoRiesgoComponent', () => {
  let component: CatalogoRiesgoComponent;
  let fixture: ComponentFixture<CatalogoRiesgoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CatalogoRiesgoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CatalogoRiesgoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
