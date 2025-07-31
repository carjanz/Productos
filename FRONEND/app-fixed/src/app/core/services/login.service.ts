import { Injectable } from '@angular/core';
import { AuthService } from '../auth/auth.service';

@Injectable({ providedIn: 'root' })
export class LoginService {
  constructor(private authService: AuthService) {}

  authenticate(credentials: { email: string; password: string }) {
    return this.authService.login(credentials);
  }
}
