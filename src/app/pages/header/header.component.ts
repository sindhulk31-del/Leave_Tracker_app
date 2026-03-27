import { Component, OnInit, inject } from '@angular/core';
import { Router, RouterLink, RouterOutlet, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CustomButtonComponent } from 'src/app/shared/custom-button/custom-button.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterOutlet, CustomButtonComponent, RouterModule],
  templateUrl: './header.component.html',
})
export class HeaderComponent implements OnInit {
  private router = inject(Router);

  isCollapsed = false;
  userName = '';
  role = '';
  
  today: Date = new Date();

  ngOnInit() {
    const data = localStorage.getItem('leaveUser');
    if (data) {
      const obj = JSON.parse(data);
      this.userName = obj.userName || 'User';
      this.role = obj.role || 'Employee';
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