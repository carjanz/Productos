import { Injectable } from '@angular/core';
import { CanActivate, CanActivateChild, Router } from '@angular/router';
import { Observable, of } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate, CanActivateChild {
  constructor(private _router: Router) {}

  canActivate(): Observable<boolean> {
    const token = localStorage.getItem('token');

    if (!token) {
      // Si no está autenticado, redirige a login
      this._router.navigate(['/login']);
      return of(false);
    }

    // Si está autenticado, permite acceso
    return of(true);
  }

  canActivateChild(): Observable<boolean> {
    return this.canActivate(); // Reutiliza la misma lógica
  }
}
