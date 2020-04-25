import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CatalogoCriterioComponent } from './catalogo-criterio.component';

describe('CatalogoCriterioComponent', () => {
  let component: CatalogoCriterioComponent;
  let fixture: ComponentFixture<CatalogoCriterioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CatalogoCriterioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CatalogoCriterioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
