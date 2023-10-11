import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RedirectBlockComponent } from './redirect-block.component';

describe('RedirectBlockComponent', () => {
  let component: RedirectBlockComponent;
  let fixture: ComponentFixture<RedirectBlockComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RedirectBlockComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RedirectBlockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
