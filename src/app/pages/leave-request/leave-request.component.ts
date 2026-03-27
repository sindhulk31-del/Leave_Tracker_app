import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DatePipe, CommonModule } from '@angular/common'; 
import { ActivatedRoute, Router } from '@angular/router';
import { MasterServiceService } from '../../service/master-service.service';
import { CustomButtonComponent } from 'src/app/shared/custom-button/custom-button.component';
import { LeaveRequestFormComponent } from '../leave-request-form/leave-request-form.component'; 
import { NotificationService } from 'src/app/service/notification.service'; 
import { AllEmployeeLeaveRequestComponent } from '../all-employee-leave-request/all-employee-leave-request.component';

@Component({
  selector: 'app-leave-request',
  standalone: true,
  imports: [CommonModule, FormsModule, DatePipe, CustomButtonComponent, LeaveRequestFormComponent, AllEmployeeLeaveRequestComponent],
  templateUrl: './leave-request.component.html',
  styleUrl: './leave-request.component.css'
})
export class LeaveRequestComponent implements OnInit {

  @ViewChild('LeaveRequestFormComponent') 
  leaveRequestFormComponent!: LeaveRequestFormComponent;

  isHR = false;
  activeTab: 'my' | 'all' = 'all';
  leaveRequests: any[] = [];
  uniqueEmployees: any[] = [];
  selectedEmployeeRequests: any[] = [];
  selectedEmployeeName = '';
  pendingSickLeave = 0;
  pendingPaidLeave = 0;
  showRequestPopup = false;

  newLeaveRequestObj: any = {
    leaveId: 0,
    empId: 0,
    leaveDate: '',
    fromDate: '',
    toDate: '',
    reason: '',
    leaveType: '',
  };

  mastersrv = inject(MasterServiceService);
  route = inject(ActivatedRoute);
  router = inject(Router);
  notificationService = inject(NotificationService); 

  constructor() {
    const localData = localStorage.getItem('leaveUser');
    if (localData) {
      const user = JSON.parse(localData);
      this.newLeaveRequestObj.empId = user.empId;
      this.isHR = user.role?.toLowerCase().includes('hr');
    }
  }

  ngOnInit(): void {
    this.loadLeaveBalance();  
    const empId = this.route.snapshot.paramMap.get('empId');
    const currentUrl = this.router.url;

    if (this.isHR) {
      if (currentUrl.includes('/my')) {
        this.activeTab = 'my';
        this.loadEmployeeLeaveRequests();
      } else {
        this.activeTab = 'all';
        if (empId) {
          this.loadEmployeeLeaves(+empId);
        } else {
          this.loadAllLeaveRequests();
        }
      }
    } else {
      this.activeTab = 'my';
      this.loadEmployeeLeaveRequests();
    }
  }

  switchTab(tab: 'my' | 'all') {
    this.activeTab = tab;
    this.router.navigate([`/leave-request/${tab}`]);
  }

  loadLeaveBalance() {
    this.mastersrv.getLeaveBalanceByEmpId(this.newLeaveRequestObj.empId).subscribe((res: any[]) => {
      this.pendingSickLeave = 0;
      this.pendingPaidLeave = 0;
      res.forEach((item: any) => {
        if (item.leaveType === 'sickLeave') this.pendingSickLeave = item.count;
        if (item.leaveType === 'paidLeave') this.pendingPaidLeave = item.count;
      });
    });
  }

  loadEmployeeLeaveRequests() {
    this.mastersrv.getLeaveRequestsByEmpId(this.newLeaveRequestObj.empId).subscribe(res => this.leaveRequests = res);
  }

  loadAllLeaveRequests() {
    this.mastersrv.getAllLeaveRequests().subscribe(res => {
      this.leaveRequests = res;
      this.prepareUniqueEmployees(res);
    });
  }

  prepareUniqueEmployees(data: any[]) {
    const map = new Map<number, any>();
    data.forEach(item => {
      if (!map.has(item.empId)) {
        map.set(item.empId, { empId: item.empId, empName: item.empName });
      }
    });
    this.uniqueEmployees = Array.from(map.values());
  }

  openEmployee(empId: number) {
    this.router.navigate(['/leave-request/all', empId]);
  }

  loadEmployeeLeaves(empId: number) {
    this.mastersrv.getLeaveRequestsByEmpId(empId).subscribe(res => {
      this.selectedEmployeeRequests = res;
      this.selectedEmployeeName = res[0]?.empName || '';
    });
  }

  goBack() { this.router.navigate(['/leave-request/all']); }

  openPopup() { this.showRequestPopup = true; }
  closePopup() { this.showRequestPopup = false; }

  onSaveLeaveRequest(formValue: any) {
    this.newLeaveRequestObj = { ...this.newLeaveRequestObj, ...formValue };
    if (!this.newLeaveRequestObj.fromDate || !this.newLeaveRequestObj.toDate || !this.newLeaveRequestObj.leaveType || !this.newLeaveRequestObj.reason) {
      this.notificationService.error('Please fill all required fields');
      return;
    }

    this.newLeaveRequestObj.leaveDate = this.newLeaveRequestObj.fromDate;
    this.mastersrv.onAddLeaveRequest(this.newLeaveRequestObj).subscribe({
      next: res => {
        this.notificationService.success(res.message || 'Leave request submitted');
        this.closePopup();
        this.loadEmployeeLeaveRequests();
        this.loadLeaveBalance(); 
      },
      error: err => {
        this.notificationService.error(err?.error?.message || 'Failed to add leave request');
      }
    });
  }

  onCancelLeaveRequest() {
    this.closePopup(); 
  }
}