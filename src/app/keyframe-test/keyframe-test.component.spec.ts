import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KeyframeTestComponent } from './keyframe-test.component';

describe('KeyframeTestComponent', () => {
  let component: KeyframeTestComponent;
  let fixture: ComponentFixture<KeyframeTestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KeyframeTestComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KeyframeTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
