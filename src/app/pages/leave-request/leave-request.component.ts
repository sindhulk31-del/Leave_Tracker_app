import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MasterServiceService } from '../../service/master-service.service';
import { CustomButtonComponent } from 'src/app/shared/custom-button/custom-button.component';
@Component({
  selector: 'app-leave-request',
  standalone: true,
  imports: [FormsModule, DatePipe, CustomButtonComponent],
  templateUrl: './leave-request.component.html',
  styleUrl: './leave-request.component.css'
})
export class LeaveRequestComponent implements OnInit {

  isHR = false;

   activeTab: 'my' | 'all' = 'all';

  leaveRequests: any[] = [];
  uniqueEmployees: any[] = [];
  selectedEmployeeRequests: any[] = [];
  selectedEmployeeName = '';

  
  showRequestPopup = false;

  newLeaveRequestObj: any = {
    leaveId: 0,
    empId: 0,
    leaveDate: '',
    fromDate: '',
    toDate: '',
    reason: '',
    leaveType: ''
  };

  mastersrv = inject(MasterServiceService);
  route = inject(ActivatedRoute);
  router = inject(Router);

  constructor() {
    const localData = localStorage.getItem('leaveUser');
    if (localData) {
      const user = JSON.parse(localData);
      this.newLeaveRequestObj.empId = user.empId;
      this.isHR = user.role?.toLowerCase().includes('hr');
    }
  }

  ngOnInit(): void {

  const empId = this.route.snapshot.paramMap.get('empId');
  const currentUrl = this.router.url;

  if (this.isHR) {

    if (currentUrl.includes('/my')) {
      this.activeTab = 'my';
      this.loadEmployeeLeaveRequests();
    }

    if (currentUrl.includes('/all')) {
      this.activeTab = 'all';

      if (empId) {
        this.loadEmployeeLeaves(+empId);
      } else {
        this.loadAllLeaveRequests();
      }
    }

  } else {
    this.loadEmployeeLeaveRequests();
  }
}

    switchTab(tab: 'my' | 'all') {
  this.activeTab = tab;
  this.selectedEmployeeRequests = [];

  if (tab === 'my') {
    this.router.navigate(['/leave-request/my']);
  } else {
    this.router.navigate(['/leave-request/all']);
  }
}


  loadEmployeeLeaveRequests() {
    this.mastersrv
      .getLeaveRequestsByEmpId(this.newLeaveRequestObj.empId)
      .subscribe(res => this.leaveRequests = res);
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
        map.set(item.empId, {
          empId: item.empId,
          empName: item.empName
        });
      }
    });
    this.uniqueEmployees = Array.from(map.values());
  }

  openEmployee(empId: number) {
    this.router.navigate(['/leave-request', empId]);
  }

  loadEmployeeLeaves(empId: number) {
    this.mastersrv.getLeaveRequestsByEmpId(empId).subscribe(res => {
      this.selectedEmployeeRequests = res;
      this.selectedEmployeeName = res[0]?.empName || '';
    });
  }

  goBack() {
    this.router.navigate(['/leave-request']);
  }

  /* POPUP CONTROL */
  openPopup() {
    this.showRequestPopup = true;
  }

  closePopup() {
    this.showRequestPopup = false;
  }

  onSaveLeaveRequest() {
    if (
      !this.newLeaveRequestObj.fromDate ||
      !this.newLeaveRequestObj.toDate ||
      !this.newLeaveRequestObj.leaveType ||
      !this.newLeaveRequestObj.reason
    ) {
      alert('All fields are required');
      return;
    }

    this.newLeaveRequestObj.leaveDate = this.newLeaveRequestObj.fromDate;

    this.mastersrv.onAddLeaveRequest(this.newLeaveRequestObj).subscribe(() => {
      alert('Leave request submitted');
      this.loadEmployeeLeaveRequests();
      this.onCancelLeaveRequest();
     this.closePopup(); 
    });
  }

  onCancelLeaveRequest() {
    this.newLeaveRequestObj = {
      leaveId: 0,
      empId: this.newLeaveRequestObj.empId,
      leaveDate: '',
      fromDate: '',
      toDate: '',
      reason: '',
      leaveType: ''
    };
    this.closePopup(); 
  }
}
