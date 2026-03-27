import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CustomSnackbarComponent } from '../shared/custom-snackbar/custom-snackbar.component';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(private snackBar: MatSnackBar) { }

  show(
    message: string,
    type: 'success' | 'error' | 'warning' | 'info' = 'info',
    duration: number = 3000
  ) {
    this.snackBar.openFromComponent(CustomSnackbarComponent, {
      data: { message, type },
      duration,
      horizontalPosition: 'right',
      verticalPosition: 'bottom',
      panelClass: ['custom-snackbar-container']
    });
  }

  success(message: string ) {
    this.show(message, 'success');
  }

  error(message: string ) {
    this.show(message, 'error');
  }

  warning(message: string, ) {
    this.show(message, 'warning');
  }

  info(message: string, ) {
    this.show(message, 'info');
  } 
}
