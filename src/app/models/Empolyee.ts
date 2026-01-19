 export class EmployeeModel {
    empId: number;
   empName: string;
   contactNo: string;
   email: string;
   deptName: string;
   designation: string;
   createdDate: Date;
   userName: string;
   password: string;
   sickLeaveBalance: number;
   paidLeaveBalance: number;
   role: string;

   constructor() {
       this.empId = 0;
       this.empName = '';
        this.contactNo = '';
        this.email = '';
        this.deptName = '';
        this.designation = '';
        this.createdDate = new Date();
        this.userName = '';
        this.password = '';
        this.sickLeaveBalance = 0;
        this.paidLeaveBalance = 0;
         this.role = '';
 }
}

export interface ApiResponseModel {
     result: boolean;
  message: string;
  data: any;
}

export interface LoginModel {
      userName: string;    
      password: string;
}

export interface LeaveBalanceModel {
  
}
