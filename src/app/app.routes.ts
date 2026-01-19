import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { HeaderComponent } from './pages/header/header.component';
import { EmployeeComponent } from './pages/employee/employee.component';
import { LeaveBalanceComponent } from './pages/leave-balance/leave-balance.component';
import { LeaveRequestComponent } from './pages/leave-request/leave-request.component';
import { UnauthorizedComponent } from './pages/unauthorized/unauthorized.component';
import { PageNotFoundComponent } from './shared/page-not-found/page-not-found.component';

import { authGuard } from './guards/auth.guard';
import { roleGuard } from './guards/role.guard';

export const routes: Routes = [

  { path: '', redirectTo: 'login', pathMatch: 'full' },

  { path: 'login', component: LoginComponent },

  { path: 'unauthorized', component: UnauthorizedComponent },

  {
    path: '',
    component: HeaderComponent,
    canActivate: [authGuard],
    children: [

      {
        path: 'employee',
        component: EmployeeComponent,
        canActivate: [roleGuard],
        data: { roles: ['Hr'] }   
      },

      {
        path: 'leave-balance',
        component: LeaveBalanceComponent,
        canActivate: [roleGuard],
        data: { roles: ['Hr'] } 
      },

      {
        path: 'leave-balance/:empId',
       component: LeaveBalanceComponent,
       canActivate: [roleGuard],
       data: { roles: ['Hr'] }  
      },

      {
        path: 'leave-request',
        redirectTo: 'leave-request/my',
        pathMatch: 'full'
      },

      {
        path: 'leave-request/my',
        component: LeaveRequestComponent,
        canActivate: [roleGuard],
        data: { roles: ['Hr', 'Employee'] }
      },

      {
        path: 'leave-request/all',
        component: LeaveRequestComponent,
        canActivate: [roleGuard],
        data: { roles: ['Hr'] }
      },

      {
        path: 'leave-request/all/:empId',
        component: LeaveRequestComponent,
        canActivate: [roleGuard],
        data: { roles: ['Hr'] }
      },

      // {
      //   path: 'leave-request-employee',
      //   component: LeaveRequestComponent,
      //   canActivate: [roleGuard],
      //   data: { roles: ['Employee'] }
      // }
    

    ]
  },
  
    {
    path: '**',
    component: PageNotFoundComponent
   }
];
