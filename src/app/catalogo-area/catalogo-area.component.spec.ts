import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CatalogoAreaComponent } from './catalogo-area.component';

describe('CatalogoAreaComponent', () => {
  let component: CatalogoAreaComponent;
  let fixture: ComponentFixture<CatalogoAreaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CatalogoAreaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CatalogoAreaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
