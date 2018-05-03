import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FleetLayoutComponent } from './fleet-layout.component';

describe('FleetLayoutComponent', () => {
  let component: FleetLayoutComponent;
  let fixture: ComponentFixture<FleetLayoutComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FleetLayoutComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FleetLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
