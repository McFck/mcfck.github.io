import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnimeStatsListsComponent } from './anime-stats-lists.component';

describe('AnimeStatsListsComponent', () => {
  let component: AnimeStatsListsComponent;
  let fixture: ComponentFixture<AnimeStatsListsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AnimeStatsListsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AnimeStatsListsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
