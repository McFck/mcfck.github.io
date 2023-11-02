import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnimeCommunityStatsComponent } from './anime-community-stats.component';

describe('AnimeCommunityStatsComponent', () => {
  let component: AnimeCommunityStatsComponent;
  let fixture: ComponentFixture<AnimeCommunityStatsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AnimeCommunityStatsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AnimeCommunityStatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
