import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TireListComponent } from './tire-list.component';

describe('TireListComponent', () => {
  let component: TireListComponent;
  let fixture: ComponentFixture<TireListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TireListComponent]
    });
    fixture = TestBed.createComponent(TireListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
