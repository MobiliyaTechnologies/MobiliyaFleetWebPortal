import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditFleetComponent } from './edit-fleet.component';

describe('EditFleetComponent', () => {
  let component: EditFleetComponent;
  let fixture: ComponentFixture<EditFleetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditFleetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditFleetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
