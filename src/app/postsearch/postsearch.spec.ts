import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Postsearch } from './postsearch';

describe('Postsearch', () => {
  let component: Postsearch;
  let fixture: ComponentFixture<Postsearch>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Postsearch],
    }).compileComponents();

    fixture = TestBed.createComponent(Postsearch);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
