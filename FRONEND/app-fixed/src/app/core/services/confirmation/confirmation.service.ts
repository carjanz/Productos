import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { merge } from 'lodash-es';
import { FuseConfirmationDialogComponent } from './dialog/dialog.component';
import { FuseConfirmationConfig } from './confirmation.types';

@Injectable({
  providedIn: 'root'
})
export class FuseConfirmationService {
  private _defaultConfig: FuseConfirmationConfig = {
    title: 'Confirm action',
    message: 'Are you sure you want to confirm this action?',
    icon: {
      show: true,
      name: 'heroicons_outline:exclamation',
      color: 'warn'
    },
    actions: {
      confirm: {
        show: true,
        label: 'Confirm',
        color: 'warn'
      },
      cancel: {
        show: true,
        label: 'Cancel'
      }
    },
    dismissible: false
  };

  constructor(private _matDialog: MatDialog) {}

  open(config: FuseConfirmationConfig = {}): MatDialogRef<FuseConfirmationDialogComponent> {
    const userConfig = merge({}, this._defaultConfig, config);
    return this._matDialog.open(FuseConfirmationDialogComponent, {
      autoFocus: false,
      disableClose: !userConfig.dismissible,
      data: userConfig,
      panelClass: config.style ?? 'fuse-confirmation-dialog-panel'
    });
  }
}
