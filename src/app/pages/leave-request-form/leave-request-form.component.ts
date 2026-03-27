import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CustomButtonComponent } from 'src/app/shared/custom-button/custom-button.component';

@Component({
  selector: 'app-leave-request-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, CustomButtonComponent],
  templateUrl: './leave-request-form.component.html',
  // styleUrls: ['./leave-request-form.component.css']
})
export class LeaveRequestFormComponent {

  @Input() empId!: number;
  @Output() submitForm = new EventEmitter<any>();
  @Output() cancelForm = new EventEmitter<void>();

  leaveForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.leaveForm = this.fb.group({
      fromDate: ['', Validators.required],
      toDate: ['', Validators.required],
      leaveType: ['', Validators.required],
      reason: ['', Validators.required]
    });
  }

  submit() {
    if (this.leaveForm.invalid) {
      this.leaveForm.markAllAsTouched();
      return;
    }

    this.submitForm.emit(this.leaveForm.value);
  }

  resetForm() {
    this.leaveForm.reset();
  }

  cancel() {
    this.resetForm();
    this.cancelForm.emit();
  }
}
