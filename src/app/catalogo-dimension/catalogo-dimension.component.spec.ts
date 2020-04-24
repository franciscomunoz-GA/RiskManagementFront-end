import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CatalogoDimensionComponent } from './catalogo-dimension.component';

describe('CatalogoDimensionComponent', () => {
  let component: CatalogoDimensionComponent;
  let fixture: ComponentFixture<CatalogoDimensionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CatalogoDimensionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CatalogoDimensionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
