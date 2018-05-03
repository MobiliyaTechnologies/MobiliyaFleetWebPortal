import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppRouterComponent } from './app-router.component';

describe('AppRouterComponent', () => {
  let component: AppRouterComponent;
  let fixture: ComponentFixture<AppRouterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AppRouterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppRouterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
