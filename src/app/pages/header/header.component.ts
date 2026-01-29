import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterOutlet} from '@angular/router';
import { RouterLink } from '@angular/router';
import { CustomButtonComponent } from 'src/app/shared/custom-button/custom-button.component';
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, CustomButtonComponent],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  public menuOpen = false;
  public userName = '';
  public role = '';

  constructor(private router: Router) {}

  ngOnInit() {
  const localData = localStorage.getItem('leaveUser');
  if (localData != null) {
    const parseObj = JSON.parse(localData);
    this.userName = parseObj.userName;
    this.role = parseObj.role;
  }
  }

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  logout() {
    try{
    localStorage.removeItem('leaveUser');
  }catch(err){
    }
    this.router.navigate(['/login']);
  }
}
