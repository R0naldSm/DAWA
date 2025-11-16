import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Aboutof } from './aboutof';

describe('Aboutof', () => {
  let component: Aboutof;
  let fixture: ComponentFixture<Aboutof>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Aboutof]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Aboutof);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
