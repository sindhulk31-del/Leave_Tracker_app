import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, Validators } from '@angular/forms';
import { EmployeeModel } from '../../models/Empolyee';
import { CustomButtonComponent } from 'src/app/shared/custom-button/custom-button.component';
import { EmployeeFormComponent } from '../employee-form/employee-form.component';
import { CustomValidators } from 'src/app/Validators/custom-validators';
import { MasterServiceService } from 'src/app/service/master-service.service';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import { NotificationService } from 'src/app/service/notification.service';
@Component({
  selector: 'app-employee',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CustomButtonComponent,
    EmployeeFormComponent,
    MatSnackBarModule
  ],
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.css']
})
export class EmployeeComponent implements OnInit {

  employeeList: EmployeeModel[] = [];
  filteredEmployees: EmployeeModel[] = [];

  showModal = false;
  searchText = '';

  selectedEmployee: EmployeeModel | null = null;

  selectedEmpId: number | null = null;
  showDeletePopup = false;
 employeeForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
   private masterSer: MasterServiceService,
    private notificationService: NotificationService
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



  loadEmployees() {
    this.masterSer.getAllEmployees().subscribe({
      next: res => {
        this.employeeList = res;
        this.filteredEmployees = res;
      },
      error: () => {
        this.notificationService.error('Failed to load employees');
        
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
    this.selectedEmployee = null;
    this.showModal = true;

  }

  editEmployee(emp: EmployeeModel) {
    this.selectedEmployee = emp;
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.selectedEmployee = null;
  }

  onSave(emp: EmployeeModel) {
    this.masterSer.createEmployee(emp).subscribe({
      next: res => {
        this.notificationService.success(res.message);
        this.closeModal();
        this.loadEmployees();
        
      },
      error: err => {
        this.notificationService.error(err?.error?.message || 'Failed to create employee');
      }
    });
  }

  onUpdate(emp: EmployeeModel) {
    this.masterSer.updateEmployee(emp).subscribe({
      next: res => {
        this.notificationService.success(res.message);
        this.closeModal();
        this.loadEmployees();
      },
      error: err => {
        this.notificationService.error(err?.error?.message || 'Failed to update employee');
      }
    });
  }

  deleteEmployee(empId: number) {
    this.selectedEmpId = empId;
    this.showDeletePopup = true;
  }

  closeDeletePopup() {
    this.showDeletePopup = false;
    this.selectedEmpId = null;
    
  }

  confirmDelete() {
    if (!this.selectedEmpId) return;

    this.masterSer.deleteEmployee(this.selectedEmpId).subscribe({
      next: (res: any) => {
        this.notificationService.success(res.message);
        this.loadEmployees();
        this.closeDeletePopup();
      },
      error: err => {
        this.notificationService.error(
          err?.error?.message || 'Failed to delete employee'
        );
        this.closeDeletePopup();
      }
    });
  }
}
