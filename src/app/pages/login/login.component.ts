import { Component, inject, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MasterServiceService } from '../../service/master-service.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NotificationService } from 'src/app/service/notification.service'; 
import { CustomButtonComponent } from 'src/app/shared/custom-button/custom-button.component';
import { StorageService } from 'src/app/service/storage.service';
import { finalize, Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, CustomButtonComponent],
  templateUrl: './login.component.html',
})
export class LoginComponent implements OnDestroy {
  private masterService = inject(MasterServiceService);
  private router = inject(Router);
  private notificationService = inject(NotificationService); 
  private storageService = inject(StorageService);
  private destroy$ = new Subject<void>();
  public isLoading = false;

  showPassword = false;

  loginform = new FormGroup({
    userName: new FormControl('', { validators: [Validators.required], nonNullable: true }),
    password: new FormControl('', { validators: [Validators.required], nonNullable: true })
  });

  onLogin() {

    if(this.isValidForm()) {
      const payload = this.loginform.getRawValue();
      this.isLoading = true;
      this.masterService.onLogin(payload)
      .pipe(takeUntil(this.destroy$), finalize(() => this.isLoading = false))
      .subscribe({
        next: (result: any) => {
          if (result) {
            this.storageService.storeData('leaveUser', result);
            this.notificationService.success('Login successful'); 
            this.navigateToRespectivePage(result.role);
          }
        },
        error: (error: any) => {
          this.notificationService.error(
            error.error?.message || 'Invalid username or password'
          );
        }
      });
    } else {
      this.notificationService.warning('Please fill in all fields');
    }
  }

  navigateToRespectivePage(role: string) {
    if (role === 'Hr') {
      this.router.navigateByUrl('employee');
    } else {
      this.router.navigateByUrl('leave-request');
    } 
  }

  isValidForm() {
    return this.loginform.valid
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

}