import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MasterServiceService } from '../../service/master-service.service';
import { Observable } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { CustomButtonComponent } from 'src/app/shared/custom-button/custom-button.component';
import { LeaveBalanceFormComponent } from '../leave-balance-form/leave-balance-form.component';
import { NotificationService } from 'src/app/service/notification.service'; 

@Component({
  selector: 'app-leave-balance',
  standalone: true, 
  imports: [FormsModule, CustomButtonComponent, LeaveBalanceFormComponent],
  templateUrl: './leave-balance.component.html',
})
export class LeaveBalanceComponent implements OnInit {

  masterSer = inject(MasterServiceService);
  route = inject(ActivatedRoute);
  router = inject(Router);
  notificationService = inject(NotificationService); 

  allEmployeesList$: Observable<any[]> = new Observable<any[]>;
  leavaeBalanceList: any[] = [];
  groupedEmployees: any[] = [];
  selectedEmployee: any = null;
  routeEmpId: number | null = null;
  showModal = false;

  newLeaveBalance: any = {
    balanceId: 0,
    empId: 0,
    updatedDate: new Date(),
    count: 0,
    updateBy: 0,
    leaveType: ''
  };

  constructor() {
    this.allEmployeesList$ = this.masterSer.getAllEmployees();

    const localData = localStorage.getItem('leaveUser');
    if (localData) {
      this.newLeaveBalance.updateBy = JSON.parse(localData).empId;
    }
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const empId = Number(params.get('empId'));
      this.routeEmpId = empId || null;

      if (this.routeEmpId && this.groupedEmployees.length) {
        this.selectEmployeeByRoute(this.routeEmpId);
      }

      if (!empId) {
        this.selectedEmployee = null;
      }
    });

    this.getAllLeaveBalance();
  }

  selectEmployeeByRoute(empId: number) {
    const emp = this.groupedEmployees.find(e => e.empId === empId);
    if (emp) {
      this.selectedEmployee = emp;
    }
  }

  getAllLeaveBalance() {
    this.masterSer.getAllLeave().subscribe({
      next: (result: any[]) => {
        this.leavaeBalanceList = result;
        this.groupEmployees();

        if (this.routeEmpId) {
          this.selectEmployeeByRoute(this.routeEmpId);
        }
      },
      error: () => {
        this.notificationService.error('Error fetching leave balances');
      }
    });
  }

  groupEmployees() {
    const map = new Map<number, any>();

    this.leavaeBalanceList.forEach(item => {
      if (!map.has(item.empId)) {
        map.set(item.empId, {
          empId: item.empId,
          empName: item.empName,
          paidLeave: 0,
          sickLeave: 0,
          totalLeave: 0
        });
      }

      const emp = map.get(item.empId);

      if (item.leaveType === 'paidLeave') {
        emp.paidLeave = item.count;
      }

      if (item.leaveType === 'sickLeave') {
        emp.sickLeave = item.count;
      }

      emp.totalLeave = emp.paidLeave + emp.sickLeave;
    });

    this.groupedEmployees = Array.from(map.values());
  }

  selectEmployee(emp: any) {
    this.selectedEmployee = emp;
  }

  backToTable() {
    this.selectedEmployee = null;
  }

  openModel() {
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }

  onSaveBalance(formValue: any) {
    this.newLeaveBalance = { ...this.newLeaveBalance, ...formValue };
    if (!this.newLeaveBalance.empId || !this.newLeaveBalance.leaveType) {
      this.notificationService.error('Please select employee and leave type');
      return;
    }

    this.masterSer.onAddLeave(this.newLeaveBalance).subscribe({
      next: res => {
        this.notificationService.success(res.message || 'Leave balance updated');
        this.closeModal();
        this.getAllLeaveBalance();
      },
      error: err => {
        this.notificationService.error(err?.error?.message || 'Failed to add leave balance');
      }
    });
  }
}