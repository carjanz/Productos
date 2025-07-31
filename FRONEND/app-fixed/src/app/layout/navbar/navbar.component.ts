// src/app/components/navbar/navbar.component.ts
import {
  Component,
  OnInit,
  OnDestroy,
  inject
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { Subscription, take } from 'rxjs';

import { AuthService } from 'src/app/core/auth/auth.service';
import { AppAlertService } from 'src/app/core/services/app-alert.service';
import { SettingsService } from 'src/app/core/services/settings.service';
import { TokenManagerService } from 'src/app/core/services/token-manager.service';
import { ConfirmDialogResponses } from 'src/app/core/enums/confirm-dialog-responses.enum';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule, MatIconModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit, OnDestroy {
  isLoggedIn = false;
  private subscriptions: Subscription[] = [];

  constructor(
    private router: Router,
    private settings: SettingsService,
    private alertService: AppAlertService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    // Escuchar estado de sesión
    this.subscriptions.push(
      this.authService.isLoggedIn$.subscribe(status => {
        this.isLoggedIn = status;
      })
    );

    // Cerrar sidebar y hacer scroll top en navegación
    this.subscriptions.push(
      this.router.events.subscribe(() => {
        this.settings.layout.asideToggled = false;
        window.scrollTo(0, 0);
      })
    );
  }


  logout(): void {
    this.alertService
      .showWarningConfirm('Cerrar sesión', ['¿Realmente desea salir de la aplicación?'])
      .pipe(take(1))
      .subscribe((response: string) => {
        if (response === ConfirmDialogResponses.Confirmed) {
           this.authService.logout();
          this.router.navigate(['/login']);
        }
      });
  }


  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
}
