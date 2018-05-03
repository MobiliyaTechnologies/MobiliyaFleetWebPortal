import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterRuleDialogComponent } from './filter-rule-dialog.component';

describe('FilterRuleDialogComponent', () => {
  let component: FilterRuleDialogComponent;
  let fixture: ComponentFixture<FilterRuleDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FilterRuleDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FilterRuleDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
