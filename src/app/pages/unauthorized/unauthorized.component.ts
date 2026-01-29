import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CustomButtonComponent } from "src/app/shared/custom-button/custom-button.component";

@Component({
  selector: 'app-unauthorized',
  imports: [CustomButtonComponent],
  templateUrl: './unauthorized.component.html',
  styleUrl: './unauthorized.component.css'
})
export class UnauthorizedComponent {
constructor(private router: Router) {}
  goBack() {
    this.router.navigate(['/']);
  }
}
