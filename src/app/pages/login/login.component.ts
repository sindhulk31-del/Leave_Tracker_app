import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MasterServiceService } from '../../service/master-service.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NotificationService } from 'src/app/service/notification.service'; 
import { CustomButtonComponent } from 'src/app/shared/custom-button/custom-button.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, CustomButtonComponent],
  templateUrl: './login.component.html',
})
export class LoginComponent {
  private masterService = inject(MasterServiceService);
  private router = inject(Router);
  private notificationService = inject(NotificationService); 

  showPassword = false;

  loginform = new FormGroup({
    userName: new FormControl('', { validators: [Validators.required], nonNullable: true }),
    password: new FormControl('', { validators: [Validators.required], nonNullable: true })
  });

  onLogin() {
    if (this.loginform.invalid) {
      this.notificationService.warning('Please fill in all fields'); 
      return;
    }

    const payload = this.loginform.getRawValue();

    this.masterService.onLogin(payload).subscribe({
      next: (result: any) => {
        if (result) {
          localStorage.setItem('leaveUser', JSON.stringify(result));
          this.notificationService.success('Login successful'); 
          const target = result.role === 'Hr' ? 'employee' : 'leave-request';
          this.router.navigateByUrl(target);
        }
      },
      error: (error: any) => {
        this.notificationService.error(
          error.error?.message || 'Invalid username or password'
        );
      }
    });
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }
}