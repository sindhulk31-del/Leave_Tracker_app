import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../service/auth.service';

export const roleGuard: CanActivateFn = (route) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  const allowedRoles = route.data?.['roles'] as string[];
  const userRole = auth.getRole();

  if (allowedRoles?.includes(userRole || '')) {
    return true;
  }

  router.navigate(['/unauthorized']);
  return false;
};
