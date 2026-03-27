import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AsyncPipe } from '@angular/common';
import { CustomButtonComponent } from 'src/app/shared/custom-button/custom-button.component';

@Component({
  selector: 'app-leave-balance-form',
  standalone: true,
  imports: [ReactiveFormsModule, AsyncPipe, CustomButtonComponent],
  templateUrl: './leave-balance-form.component.html',
  // styleUrl: './leave-balance-form.component.css'
})
export class LeaveBalanceFormComponent implements OnInit {

  @Input() employees$!: any;
  @Input() showModal = false;

  @Output() save = new EventEmitter<any>();
  @Output() cancel = new EventEmitter<void>();


  leaveForm!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.leaveForm = this.fb.group({
      empId: [0, Validators.required],
      leaveType: ['', Validators.required],
      count: [0, [Validators.required, Validators.min(1)]]
    });
  }


  submit() {
    if (this.leaveForm.invalid) {
      this.leaveForm.markAllAsTouched();
      return;
    }
    this.save.emit(this.leaveForm.value);
    this.resetForm();
  }

  resetForm() {
  this.leaveForm.reset({
    empId: 0,
    leaveType: '',
    count: 0
  });
}

  closeModal() {
  this.cancel.emit();
  this.resetForm();
}

}
