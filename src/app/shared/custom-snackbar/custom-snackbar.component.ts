import { Component, Inject } from '@angular/core';
import { MAT_SNACK_BAR_DATA, MatSnackBarRef } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-custom-snackbar',
  imports: [CommonModule, MatIconModule ],
  templateUrl: './custom-snackbar.component.html',
  styleUrl: './custom-snackbar.component.css'
})
export class CustomSnackbarComponent {

  constructor(
    @Inject(MAT_SNACK_BAR_DATA) public data: any,
    private snackBarRef: MatSnackBarRef<CustomSnackbarComponent>
  ) { }

 getIcon(type: string): string {
  const icons: any = {
    success: 'check_circle',
    error: 'cancel',
    warning: 'warning',
    info: 'info'
  };

  return icons[type] || 'notifications';
}



  close() {
    this.snackBarRef.dismiss(); 
  }

}

