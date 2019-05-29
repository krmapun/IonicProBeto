import { TestBed } from '@angular/core/testing';

import { CalculadorService } from './calculador.service';

describe('CalculadorService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CalculadorService = TestBed.get(CalculadorService);
    expect(service).toBeTruthy();
  });
});
