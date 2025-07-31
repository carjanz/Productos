import { Injectable } from '@angular/core';
import { CanActivate, CanActivateChild, Router } from '@angular/router';
import { Observable, of } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class NoAuthGuard implements CanActivate, CanActivateChild {
  constructor(private _router: Router) {}

  canActivate(): Observable<boolean> {
    const token = localStorage.getItem('token');

    if (token) {
      // Si ya está autenticado, redirige a dashboard
      this._router.navigate(['/dashboard']);
      return of(false);
    }

    // Si NO está autenticado, permite acceso
    return of(true);
  }

  canActivateChild(): Observable<boolean> {
    return this.canActivate(); // Reutiliza la misma lógica
  }
}
