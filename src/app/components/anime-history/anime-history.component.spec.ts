import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnimeHistoryComponent } from './anime-history.component';

describe('AnimeHistoryComponent', () => {
  let component: AnimeHistoryComponent;
  let fixture: ComponentFixture<AnimeHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AnimeHistoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AnimeHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
