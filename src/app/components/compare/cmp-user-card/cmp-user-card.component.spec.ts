import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CmpUserCardComponent } from './cmp-user-card.component';

describe('CmpUserCardComponent', () => {
  let component: CmpUserCardComponent;
  let fixture: ComponentFixture<CmpUserCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CmpUserCardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CmpUserCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
