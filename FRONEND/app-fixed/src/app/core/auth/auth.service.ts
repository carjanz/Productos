import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Response } from '../interfaces/result-response.interface';
import { RegisterUser } from '../interfaces/register-user.interface';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private loggedIn = new BehaviorSubject<boolean>(this.hasToken());
  isLoggedIn$ = this.loggedIn.asObservable();

  constructor(private http: HttpClient) {}

  private hasToken(): boolean {
    return !!localStorage.getItem('token');
  }

  login(credentials: { email: string; password: string }): Observable<Response> {
    return this.http.post<Response>(`${environment.END_POINT_APP}/Tokens`, credentials).pipe(
      map((res) => {
        if (res.succeeded && res.data?.token) {
          localStorage.setItem('token', res.data.token);
          localStorage.setItem('refreshToken', res.data.refreshToken);
          this.loggedIn.next(true);
          return res;
        } else {
          return { succeeded: false, data: null, messages: res.messages };
        }
      }),
      catchError((err) => {
        const mensaje =
          err?.error?.messages?.[0] ||
          err?.error?.message ||
          err?.statusText ||
          'Error desconocido en login';
        return throwError(() => new Error(mensaje));
      })
    );
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    this.loggedIn.next(false);
    window.location.href = '/';
  }

  register(params: RegisterUser): Observable<Response> {
    return this.http.post<Response>(`${environment.END_POINT_APP}/Identity/users`, params).pipe(
      catchError((err) => {
        const msg = err?.error?.messages?.[0] || 'Error al registrar usuario';
        return throwError(() => new Error(msg));
      })
    );
  }
}
