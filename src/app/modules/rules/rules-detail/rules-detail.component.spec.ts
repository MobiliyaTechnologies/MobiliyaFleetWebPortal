import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RulesDetailComponent } from './rules-detail.component';

describe('RulesDetailComponent', () => {
  let component: RulesDetailComponent;
  let fixture: ComponentFixture<RulesDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RulesDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RulesDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
