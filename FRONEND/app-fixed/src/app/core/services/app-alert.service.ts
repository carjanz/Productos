import { Injectable, NgZone } from '@angular/core';
import { MatSnackBar, MatSnackBarRef } from '@angular/material/snack-bar';
import { Observable } from 'rxjs';
import { AppSnackBarComponent } from '../../shared/app-snack-bar/app-snack-bar.component';
import { FuseConfirmationService, FuseConfirmationConfig } from './confirmation';

@Injectable({
  providedIn: 'root'
})
export class AppAlertService {

  snackBarRef!: MatSnackBarRef<AppSnackBarComponent>;

  constructor(
    private snackBar: MatSnackBar,
    private _fuseConfirmationService: FuseConfirmationService,
    private _ngZone: NgZone
  ) {}

  showSuccess(message: string): void {
    this._openSnackBar(message, 'success');
  }

  showInfo(message: string): void {
    this._openSnackBar(message, 'info');
  }

  showWarning(message: string): void {
    this._openSnackBar(message, 'warning');
  }

  showError(message: string): void {
    this._openSnackBar(message, 'error');
  }

  showInfoConfirm(title: string, messages: string[]): Observable<any> {
    return this._openConfirmDialog(title, messages, 'info', true, 'Aceptar');
  }

  showWarningConfirm(title: string, messages: string[]): Observable<any> {
    return this._openConfirmDialog(title, messages, 'warning', true, 'Aceptar');
  }

  showErrorDialog(title: string, messages: string[]): Observable<any> {
    return this._openConfirmDialog(title, messages, 'error');
  }

  showInfoDialog(title: string, messages: string[], style: string = 'fuse-confirmation-dialog-panel'): Observable<any> {
    return this._openConfirmDialog(title, messages, 'info', false, '', '', style);
  }

  private _openSnackBar(
    message: string,
    type: 'success' | 'info' | 'warning' | 'error',
    duration: number = 6000,
    verticalPosition: 'top' | 'bottom' = 'top',
    horizontalPosition: 'start' | 'center' | 'end' | 'left' | 'right' = 'right'
  ) {
    this._ngZone.run(() => {
      const snackType = type || 'success';
      if (this.snackBarRef) {
        this.snackBarRef.dismiss();
      }

      this.snackBarRef = this.snackBar.openFromComponent(AppSnackBarComponent, {
        duration,
        horizontalPosition,
        verticalPosition,
        panelClass: ['app-snack-bar'],
        data: { message, snackType, snackBar: this.snackBar }
      });
    });
  }

  private _openConfirmDialog(
    title: string,
    messages: string[],
    type: 'info' | 'error' | 'warning',
    showCancelButton: boolean = false,
    confirmLabel: string = '',
    cancelLabel: string = '',
    style: string = 'fuse-confirmation-dialog-panel'
  ): Observable<any> {
    return this._ngZone.run(() => {
      let iconName = 'heroicons_solid:information-circle';
      let iconColor: 'primary' | 'accent' | 'warn' | 'basic' | 'info' | 'success' | 'warning' | 'error' = 'info';
      let confirmColor: 'primary' | 'accent' | 'warn' | 'warning' | 'info' = 'info';

      switch (type) {
        case 'error':
          iconName = 'heroicons_outline:x-circle';
          iconColor = 'error';
          confirmColor = 'warn';
          break;
        case 'warning':
          iconName = 'heroicons_solid:exclamation';
          iconColor = 'warning';
          confirmColor = 'warning';
          break;
      }

      const config: FuseConfirmationConfig = {
        title,
        message: messages.length > 1
          ? '<ul class="list-disc mt-3"><li>' + messages.join('</li><li>') + '</li></ul>'
          : '<div class="mt-3">' + messages[0] + '</div>',
        icon: {
          show: true,
          name: iconName,
          color: iconColor
        },
        actions: {
          confirm: {
            show: true,
            label: confirmLabel || 'Aceptar',
            color: confirmColor,
            icon: {
              show: true,
              name: 'mat_outline:check_circle'
            }
          },
          cancel: {
            show: showCancelButton,
            label: cancelLabel || 'Cancelar',
            icon: {
              show: true,
              name: 'mat_outline:cancel'
            }
          }
        },
        style
      };

      const dialogRef = this._fuseConfirmationService.open(config);
      return dialogRef.afterClosed();
    });
  }
}
