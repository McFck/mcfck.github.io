import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnimeCommunityBlockComponent } from './anime-community-block.component';

describe('AnimeCommunityBlockComponent', () => {
  let component: AnimeCommunityBlockComponent;
  let fixture: ComponentFixture<AnimeCommunityBlockComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AnimeCommunityBlockComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AnimeCommunityBlockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
