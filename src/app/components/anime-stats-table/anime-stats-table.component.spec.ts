import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnimeStatsTableComponent } from './anime-stats-table.component';

describe('AnimeStatsTableComponent', () => {
  let component: AnimeStatsTableComponent;
  let fixture: ComponentFixture<AnimeStatsTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AnimeStatsTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AnimeStatsTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
