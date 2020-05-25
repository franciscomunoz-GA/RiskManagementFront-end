import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RiesgosAreasComponent } from './riesgos-areas.component';

describe('RiesgosAreasComponent', () => {
  let component: RiesgosAreasComponent;
  let fixture: ComponentFixture<RiesgosAreasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RiesgosAreasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RiesgosAreasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
