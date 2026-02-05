import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterOutlet } from '@angular/router';
import { CustomButtonComponent } from 'src/app/shared/custom-button/custom-button.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterOutlet, CustomButtonComponent],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  isCollapsed = false;
  userName = '';
  role = '';

  constructor(private router: Router) {}

  ngOnInit() {
    const data = localStorage.getItem('leaveUser');
    if (data) {
      const obj = JSON.parse(data);
      this.userName = obj.userName;
      this.role = obj.role;
    }
  }

  toggleSidebar() {
    this.isCollapsed = !this.isCollapsed;
  }

  logout() {
    localStorage.removeItem('leaveUser');
    this.router.navigate(['/login']);
  }
}
