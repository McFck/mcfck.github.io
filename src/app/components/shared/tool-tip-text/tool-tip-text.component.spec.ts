import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ToolTipTextComponent } from './tool-tip-text.component';

describe('ToolTipTextComponent', () => {
  let component: ToolTipTextComponent;
  let fixture: ComponentFixture<ToolTipTextComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ToolTipTextComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ToolTipTextComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
