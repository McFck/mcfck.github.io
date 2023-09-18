import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmptyTypedDataComponent } from './empty-typed-data.component';

describe('EmptyTypedDataComponent', () => {
  let component: EmptyTypedDataComponent;
  let fixture: ComponentFixture<EmptyTypedDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmptyTypedDataComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmptyTypedDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
