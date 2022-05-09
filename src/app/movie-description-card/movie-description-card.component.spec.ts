import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MovieDescriptionCardComponent } from './movie-description-card.component';

describe('MovieDescriptionCardComponent', () => {
  let component: MovieDescriptionCardComponent;
  let fixture: ComponentFixture<MovieDescriptionCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MovieDescriptionCardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MovieDescriptionCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
