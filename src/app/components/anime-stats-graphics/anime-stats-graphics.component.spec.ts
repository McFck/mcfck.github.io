import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnimeStatsGraphicsComponent } from './anime-stats-graphics.component';

describe('AnimeStatsGraphicsComponent', () => {
  let component: AnimeStatsGraphicsComponent;
  let fixture: ComponentFixture<AnimeStatsGraphicsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AnimeStatsGraphicsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AnimeStatsGraphicsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
