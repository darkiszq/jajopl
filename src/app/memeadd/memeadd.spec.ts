import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Memeadd } from './memeadd';

describe('Memeadd', () => {
  let component: Memeadd;
  let fixture: ComponentFixture<Memeadd>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Memeadd],
    }).compileComponents();

    fixture = TestBed.createComponent(Memeadd);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
