import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CatalogoTipoRiesgoComponent } from './catalogo-tipo-riesgo.component';

describe('CatalogoTipoRiesgoComponent', () => {
  let component: CatalogoTipoRiesgoComponent;
  let fixture: ComponentFixture<CatalogoTipoRiesgoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CatalogoTipoRiesgoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CatalogoTipoRiesgoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
