import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResetPassPage } from './reset-pass.page';

describe('ResetPassPage', () => {
  let component: ResetPassPage;
  let fixture: ComponentFixture<ResetPassPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResetPassPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResetPassPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
