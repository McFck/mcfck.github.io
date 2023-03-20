import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnimeTimeComponent } from './anime-time.component';

describe('AnimeTimeComponent', () => {
  let component: AnimeTimeComponent;
  let fixture: ComponentFixture<AnimeTimeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AnimeTimeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AnimeTimeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
