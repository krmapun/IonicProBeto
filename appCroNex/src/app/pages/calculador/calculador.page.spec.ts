import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CalculadorPage } from './calculador.page';

describe('CalculadorPage', () => {
  let component: CalculadorPage;
  let fixture: ComponentFixture<CalculadorPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CalculadorPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CalculadorPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
