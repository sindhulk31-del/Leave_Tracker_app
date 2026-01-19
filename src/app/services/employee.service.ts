import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { EmployeeModel, ApiResponseModel } from '../models/Empolyee';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {


  private baseUrl = 'https://api.freeprojectapi.com/api/leaveTracker';

  constructor(private http: HttpClient) {}

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

}
