import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {  LoginModel } from '../models/Empolyee';

@Injectable({
  providedIn: 'root'
})
export class MasterServiceService {

  constructor(private http: HttpClient) { }

  onLogin(obj:LoginModel){
    return this.http.post<any>('https://api.freeprojectapi.com/api/LeaveTracker/login',obj);
  }

  getAllEmployee(){
    return this.http.get<any[]>('https://api.freeprojectapi.com/api/LeaveTracker/GetAllEmployee');
  }
  onAddLeave(obj:any){
    return this.http.post<any>('https://api.freeprojectapi.com/api/LeaveTracker/AddLeaveBalance',obj);
  }

  getAllLeave(){
    return this.http.get<any[]>('https://api.freeprojectapi.com/api/LeaveTracker/GetAllBalances');
  }

   getLeaveRequestsByEmpId(empId: number) {
    return this.http.get<any[]>(
      'https://api.freeprojectapi.com/api/LeaveTracker/GetLeaveRequestsbyEmpId?empid=' + empId);
  }

  getAllLeaveRequests() {
    return this.http.get<any[]>(
      'https://api.freeprojectapi.com/api/LeaveTracker/request');
  }

  onAddLeaveRequest(obj: any) {
    return this.http.post<any>(
      'https://api.freeprojectapi.com/api/LeaveTracker/request', obj);
  }
}
