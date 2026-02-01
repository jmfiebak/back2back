import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpielErstellenComponent } from './spiel-erstellen.component';

describe('SpielErstellenComponent', () => {
  let component: SpielErstellenComponent;
  let fixture: ComponentFixture<SpielErstellenComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SpielErstellenComponent]
    });
    fixture = TestBed.createComponent(SpielErstellenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
