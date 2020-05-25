import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientesRiesgosAreasComponent } from './clientes-riesgos-areas.component';

describe('ClientesRiesgosAreasComponent', () => {
  let component: ClientesRiesgosAreasComponent;
  let fixture: ComponentFixture<ClientesRiesgosAreasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClientesRiesgosAreasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientesRiesgosAreasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
