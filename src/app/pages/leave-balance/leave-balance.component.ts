import { Component, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MasterServiceService } from '../../service/master-service.service';
import { AsyncPipe} from '@angular/common';
import { Observable } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';


@Component({
  selector: 'app-leave-balance',
  imports: [FormsModule, AsyncPipe],
  templateUrl: './leave-balance.component.html',
  styleUrl: './leave-balance.component.css'
})
export class LeaveBalanceComponent implements OnInit {

  masterSer = inject(MasterServiceService);
  route = inject(ActivatedRoute);
  router = inject(Router);

  @ViewChild('formModel') formModalViewChild!: ElementRef;

  allEmployeesList$: Observable<any[]> = new Observable<any[]>;
  leavaeBalanceList: any[] = [];
  groupedEmployees: any[] = [];
  selectedEmployee: any = null;

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
    this.allEmployeesList$ = this.masterSer.getAllEmployee();

    const localData = localStorage.getItem('leaveUser');
    if (localData) {
      this.newLeaveBalance.updateBy = JSON.parse(localData).empId;
    }
  }


  ngOnInit(): void {
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

      const empId = Number(this.route.snapshot.paramMap.get('empId'));
      if (empId) {
        this.selectEmployeeByRoute(empId);
      }
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
          totalleave: 0
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
    // this.formModalViewChild.nativeElement.style.display = 'block';
  }

  closeModel() {
     this.showModal = false;
    // this.formModalViewChild.nativeElement.style.display = 'none';
   
  }

  onSaveBalance() {
    if (!this.newLeaveBalance.empId || !this.newLeaveBalance.leaveType) {
      alert('Please select employee and leave type');
      return;
    }

    this.masterSer.onAddLeave(this.newLeaveBalance).subscribe({
      next: () => {
        alert('Leave Balance Added');
        this.closeModel();
        this.getAllLeaveBalance();
      }
    });
  }
}
