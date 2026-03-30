import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { CustomButtonComponent } from 'src/app/shared/custom-button/custom-button.component';
import { EmployeeModel } from '../../models/Empolyee';

@Component({
  selector: 'app-employee-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, CustomButtonComponent],
  templateUrl: './employee-form.component.html',
  // styleUrls: ['./employee-form.component.css']
})
export class EmployeeFormComponent implements OnChanges {
  showPassword=false;
  
  @Input() showModal = false;
  @Input() selectedEmployee: EmployeeModel | null = null;
  @Input() employeeForm!: FormGroup;

  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<EmployeeModel>();
  @Output() update = new EventEmitter<EmployeeModel>();

  constructor(private fb: FormBuilder) {
  }

  ngOnChanges(changes:SimpleChanges): void {
    if (this.selectedEmployee) {
      this.employeeForm.patchValue(this.selectedEmployee);
      this.employeeForm.get('password')?.clearValidators();
      this.employeeForm.get('password')?.updateValueAndValidity();

      
    } else {
      this.employeeForm.reset({ empId: 0 });
    }
  } 

  isInvalid(controlName: string): boolean {
    const control = this.employeeForm.get(controlName);
    return !!(control && control.invalid && (control.touched || control.dirty));
    
  }

  submit() {
    if (this.employeeForm.invalid) return;

    this.employeeForm.value.empId === 0
      ? this.save.emit(this.employeeForm.value)
      : this.update.emit(this.employeeForm.value);
  }

  closeModal() {
    this.close.emit();
  }

   togglePassword() {
    this.showPassword = !this.showPassword;
  }
}
