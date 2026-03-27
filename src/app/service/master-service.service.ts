import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {  ApiResponseModel, LoginModel } from '../models/Empolyee';
import { environment } from 'src/environments/environment'; 
import { EmployeeModel } from '../models/Empolyee';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class MasterServiceService {

  private baseUrl = environment.baseUrl;

  constructor(private http: HttpClient) { }

  onLogin(obj:LoginModel){
    return this.http.post<any>(this.baseUrl + '/login',obj);
  }

  getAllEmployees(): Observable<EmployeeModel[]> {
      return this.http.get<EmployeeModel[]>(
        `${this.baseUrl}/GetAllEmployee`
      );
    }

  createEmployee(emp: EmployeeModel): Observable<ApiResponseModel> {
    return this.http.post<ApiResponseModel>(
      `${this.baseUrl}/CreateNewEmployee`,
      emp
    );
  }

  updateEmployee(emp: EmployeeModel): Observable<ApiResponseModel> {
    return this.http.put<ApiResponseModel>(
      `${this.baseUrl}/UpdateEmployee?id=${emp.empId}`,
      emp
    );
  }

  deleteEmployee(empId: number): Observable<ApiResponseModel> {
  return this.http.delete<ApiResponseModel>(
    `${this.baseUrl}/DeleteEmployee?id=${empId}`
  );
}
  
  onAddLeave(obj:any){
    return this.http.post<any>(this.baseUrl + '/AddLeaveBalance',obj);
  }

  getAllLeave(){
    return this.http.get<any[]>(this.baseUrl + '/GetAllBalances');
  }

 getLeaveBalanceByEmpId(empId: number) {
  return this.http.get<any[]>(
    this.baseUrl + '/GetBalanceByEmployee?empId=' + empId
  );
}

  getLeaveRequestsByEmpId(empId: number) {
    return this.http.get<any[]>(
      this.baseUrl + '/GetLeaveRequestsbyEmpId?empid=' + empId);
  }

  getAllLeaveRequests() {
    return this.http.get<any[]>(
      this.baseUrl + '/request');
  }

  onAddLeaveRequest(obj: any) {
    return this.http.post<any>(
      this.baseUrl + '/request', obj);
  }
}
