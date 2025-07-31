import { BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Response } from '../interfaces/result-response.interface'; // Asegúrate de que la ruta sea correcta
import { RegisterUser } from '../interfaces/register-user.interface'; // Asegúrate de que la ruta sea correcta
import { Observable, throwError } from 'rxjs';


@Injectable({ providedIn: 'root' })
export class AuthService {
  private loggedIn = new BehaviorSubject<boolean>(this.hasToken());
  isLoggedIn$ = this.loggedIn.asObservable();

  constructor(private http: HttpClient) {}

  private hasToken(): boolean {
    return !!localStorage.getItem('token');
  }

  login(credentials: { email: string; password: string }) {
    return this.http.post<Response>(`${environment.END_POINT_APP}/Tokens`, credentials)
      .pipe(
        map(res => {
          if (res.succeeded) {
            localStorage.setItem('token', res.data?.token || '');
            localStorage.setItem('refreshToken', res.data?.refreshToken || '');
            this.loggedIn.next(true); // ✅ actualiza estado
            return res;
          } else {
            return { succeeded: false, data: null, messages: res.messages };
          }
        }),
        catchError(err => {
          throw new Error(err?.error?.messages?.[0] || 'Error en login');
        })
      );
  }

  logout() {
    localStorage.removeItem('token');
      localStorage.removeItem('refreshToken'); // opcional
    this.loggedIn.next(false); // ✅ actualiza estado
     window.location.href = '/'; // 🔄 recarga limpia y redirecciona a home

  }

    register(params: RegisterUser): Observable<Response> {
        return this.http.post<Response>(`${environment.END_POINT_APP}/Identity/users`, params)
        .pipe(
              catchError(err => {
                            const errorMsg = err?.error?.messages?.[0] ||'Error al registrar usuario';
                            return throwError(() => new Error(errorMsg));
                        })
            );
    }
}

