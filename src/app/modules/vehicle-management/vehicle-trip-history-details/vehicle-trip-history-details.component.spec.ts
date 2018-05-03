import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VehicleTripHistoryDetailsComponent } from './vehicle-trip-history-details.component';

describe('VehicleTripHistoryDetailsComponent', () => {
  let component: VehicleTripHistoryDetailsComponent;
  let fixture: ComponentFixture<VehicleTripHistoryDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VehicleTripHistoryDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VehicleTripHistoryDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
