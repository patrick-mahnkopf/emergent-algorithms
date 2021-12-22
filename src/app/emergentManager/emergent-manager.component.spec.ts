import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EmergentManagerComponent } from './emergent-manager.component';

describe('EmergentManagerComponent', () => {
  let component: EmergentManagerComponent;
  let fixture: ComponentFixture<EmergentManagerComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [EmergentManagerComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmergentManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
