import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AntsComponent } from './ants.component';

describe('AntsComponent', () => {
  let component: AntsComponent;
  let fixture: ComponentFixture<AntsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AntsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AntsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
