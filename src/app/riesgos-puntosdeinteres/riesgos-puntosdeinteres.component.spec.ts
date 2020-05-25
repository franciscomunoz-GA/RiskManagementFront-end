import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RiesgosPuntosdeinteresComponent } from './riesgos-puntosdeinteres.component';

describe('RiesgosPuntosdeinteresComponent', () => {
  let component: RiesgosPuntosdeinteresComponent;
  let fixture: ComponentFixture<RiesgosPuntosdeinteresComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RiesgosPuntosdeinteresComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RiesgosPuntosdeinteresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
