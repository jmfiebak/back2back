import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpielbrettComponent } from './spielbrett.component';

describe('SpielbrettComponent', () => {
  let component: SpielbrettComponent;
  let fixture: ComponentFixture<SpielbrettComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SpielbrettComponent]
    });
    fixture = TestBed.createComponent(SpielbrettComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
