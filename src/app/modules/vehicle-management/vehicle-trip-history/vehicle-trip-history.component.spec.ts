import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VehicleTripHistoryComponent } from './vehicle-trip-history.component';

describe('VehicleTripHistoryComponent', () => {
  let component: VehicleTripHistoryComponent;
  let fixture: ComponentFixture<VehicleTripHistoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VehicleTripHistoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VehicleTripHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
