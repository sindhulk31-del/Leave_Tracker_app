import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MasterServiceService } from '../../service/master-service.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from '../../services/loader.service';
import { CustomButtonComponent } from 'src/app/shared/custom-button/custom-button.component';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, CommonModule, CustomButtonComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  showPassword: boolean = false;
  loginform : FormGroup = new FormGroup({
    userName: new FormControl(''),
    password: new FormControl('')
  });

  constructor(
    private masterService: MasterServiceService, 
    private router: Router,
    private toastr: ToastrService,
    public loader: LoaderService 
  ) { }

  onLogin() {
  console.log('LOGIN PAYLOAD =>', this.loginform.value);
    this.loader.show();

  this.masterService.onLogin(this.loginform.value).subscribe({
    next: (result: any) => {
      this.loader.hide();

      localStorage.setItem('leaveUser', JSON.stringify(result));
      this.toastr.success('Login successful', 'Welcome');

      if(result.role === 'Hr'){
        this.router.navigateByUrl("employee");
      } else {
        this.router.navigateByUrl("leave-request");
      }
      
    },
    error: (error: any) => {
      this.loader.hide();

      this.toastr.error(
        error.error?.message || 'Invaild username or password','Login Failed'
      );
    }
  });
}

 togglePassword() {
    this.showPassword = !this.showPassword;
  }
}