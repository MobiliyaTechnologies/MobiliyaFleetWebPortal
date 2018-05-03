import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VehicleLayoutComponent } from './vehicle-layout.component';

describe('VehicleLayoutComponent', () => {
  let component: VehicleLayoutComponent;
  let fixture: ComponentFixture<VehicleLayoutComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VehicleLayoutComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VehicleLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
