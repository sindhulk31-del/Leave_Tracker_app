import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthService {

  constructor(private router: Router) {}

  getUser() {
    const user = localStorage.getItem('leaveUser');
    return user ? JSON.parse(user) : null;
  }

  isLoggedIn(): boolean {
    return !!this.getUser();
  }

  getRole(): string | null {
    return this.getUser()?.role ?? null;
  }

  logout() {
    localStorage.removeItem('leaveUser');
    this.router.navigate(['/login']);
  }
}
