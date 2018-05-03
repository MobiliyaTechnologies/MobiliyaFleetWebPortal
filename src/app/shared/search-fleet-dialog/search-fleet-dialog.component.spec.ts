import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchFleetDialogComponent } from './search-fleet-dialog.component';

describe('SearchFleetDialogComponent', () => {
  let component: SearchFleetDialogComponent;
  let fixture: ComponentFixture<SearchFleetDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchFleetDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchFleetDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
