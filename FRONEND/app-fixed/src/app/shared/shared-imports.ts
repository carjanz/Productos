// shared-imports.ts

import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

import { DataTablesModule } from 'angular-datatables';
import { RxReactiveFormsModule } from '@rxweb/reactive-form-validators';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';

export const SharedImports = [
  CommonModule,
  RouterModule,
  FormsModule,
  ReactiveFormsModule,
  MatSnackBarModule,
  MatIconModule,
  MatTooltipModule,
  DataTablesModule,
  RxReactiveFormsModule,
  BsDatepickerModule, // ✅ SIN .forRoot() aquí
];
