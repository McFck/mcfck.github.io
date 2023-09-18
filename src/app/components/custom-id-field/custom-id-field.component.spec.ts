import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomIdFieldComponent } from './custom-id-field.component';

describe('CustomIdFieldComponent', () => {
  let component: CustomIdFieldComponent;
  let fixture: ComponentFixture<CustomIdFieldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomIdFieldComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomIdFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
