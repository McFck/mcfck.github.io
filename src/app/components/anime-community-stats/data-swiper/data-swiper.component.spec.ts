import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DataSwiperComponent } from './data-swiper.component';

describe('DataSwiperComponent', () => {
  let component: DataSwiperComponent;
  let fixture: ComponentFixture<DataSwiperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DataSwiperComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DataSwiperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
