import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThemeTestComponent } from './theme-test.component';

describe('ThemeTestComponent', () => {
  let component: ThemeTestComponent;
  let fixture: ComponentFixture<ThemeTestComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ThemeTestComponent]
    });
    fixture = TestBed.createComponent(ThemeTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
