import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllEmployeeLeaveRequestComponent } from './all-employee-leave-request.component';

describe('AllEmployeeLeaveRequestComponent', () => {
  let component: AllEmployeeLeaveRequestComponent;
  let fixture: ComponentFixture<AllEmployeeLeaveRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AllEmployeeLeaveRequestComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllEmployeeLeaveRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
