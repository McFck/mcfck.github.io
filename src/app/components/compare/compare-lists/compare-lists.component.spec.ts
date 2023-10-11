import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompareListsComponent } from './compare-lists.component';

describe('CompareListsComponent', () => {
  let component: CompareListsComponent;
  let fixture: ComponentFixture<CompareListsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompareListsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CompareListsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
