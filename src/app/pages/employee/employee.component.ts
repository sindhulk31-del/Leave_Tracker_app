import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { EmployeeService } from '../../services/employee.service';
import { EmployeeModel } from '../../models/Empolyee';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from '../../services/loader.service';
import { CustomValidators } from 'src/app/Validators/custom-validators';

@Component({
  selector: 'app-employee',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.css']
})
export class EmployeeComponent implements OnInit {

  employeeForm!: FormGroup;

  employeeList: EmployeeModel[] = [];
  filteredEmployees: EmployeeModel[] = [];

  showModal = false;
  searchText = '';

  constructor(
    private empService: EmployeeService,
    private fb: FormBuilder,
    private toastr: ToastrService,
    public loader: LoaderService
  ) {}

  ngOnInit(): void {
    this.createForm();
    this.loadEmployees();
  }

 createForm() {
  this.employeeForm = this.fb.group({

    empId: 0,

    empName: ['', [
      Validators.required,
      Validators.minLength(3),
      CustomValidators.onlyAlphabets,
      CustomValidators.noEmoji
    ]],

    contactNo: ['', [
      Validators.required,
      CustomValidators.mobile10
    ]],

    email: ['', [
      Validators.required,
      Validators.email,
      CustomValidators.noEmoji
    ]],

    deptName: ['', Validators.required],

    designation: ['', Validators.required],

    userName: ['', [
      Validators.required,
      Validators.minLength(4),
      CustomValidators.noEmoji
    ]],

    password: ['', [
    Validators.required,
    Validators.minLength(8),
    CustomValidators.strongPassword
    ]],



    role: ['', Validators.required]

  });
}


 
  isInvalid(controlName: string): boolean {
    const control = this.employeeForm.get(controlName);
    return !!(control && control.invalid && (control.touched || control.dirty));
  }

  markFormTouched() {
    this.employeeForm.markAllAsTouched();
  }

  loadEmployees() {
    this.empService.getAllEmployees().subscribe({
      next: res => {
        this.employeeList = res;
        this.filteredEmployees = res;
       
      },
      error: () => {
       
        this.toastr.error('Failed to load employees', 'Error');
      }
    });
  }

  searchEmployee() {
    this.filteredEmployees = this.employeeList.filter(e =>
      e.empName.toLowerCase().includes(this.searchText.toLowerCase()) ||
      e.email.toLowerCase().includes(this.searchText.toLowerCase())
    );
  }

 openModal() { 

  this.employeeForm.reset({ empId: 0 });

  const passwordControl = this.employeeForm.get('password');
  passwordControl?.setValidators([
    Validators.required,
    Validators.minLength(8),
    CustomValidators.strongPassword
  ]);
  passwordControl?.updateValueAndValidity();

  this.showModal = true;
}


  closeModal() {
    this.showModal = false;
  }

 editEmployee(emp: EmployeeModel) {
  this.employeeForm.patchValue(emp);
  
  const passwordControl = this.employeeForm.get('password');

  passwordControl?.clearValidators();
  passwordControl?.updateValueAndValidity();

  this.showModal = true;
}


  saveEmployee() { 
    this.markFormTouched(); 

    if (this.employeeForm.invalid) return;
     this.loader.show();
     
     this.empService.createEmployee(this.employeeForm.value).
     subscribe({
         next: res => {
             this.loader.hide();
         this.toastr.success(res.message, 'Success'); 
         this.closeModal(); this.loadEmployees();
         }, 
         error: err => { 
            this.loader.hide();
             this.toastr.error(err.error.message || 'Failed to create employee', 'Error'); 
            }
         });
         }

  updateEmployee() { 
    this.markFormTouched();

     if (this.employeeForm.invalid) return;
     
     this.loader.show(); 
     
     this.empService.updateEmployee(this.employeeForm.value).
        subscribe({ 
            next: res => {
                 this.loader.hide(); 
                 this.toastr.success(res.message, 'Success'); 
                 this.closeModal(); this.loadEmployees(); 
                },
                 error: err => { 
                    this.loader.hide(); 
                    this.toastr.error(err.error.message || 'Failed to update employee', 'Error'); 
                }
             });
             }

  deleteEmployee(empId: number) {
    if (!confirm('Are you sure you want to delete this employee?')) return;

    this.loader.show();
    this.empService.deleteEmployee(empId).subscribe({
      next: res => {
        this.loader.hide();
        this.toastr.success(res.message, 'Success');
        this.loadEmployees();
      },
      error: err => {
        this.loader.hide();
        this.toastr.error(err.error.message || 'Failed to delete employee', 'Error');
      }
    });
  }
}
