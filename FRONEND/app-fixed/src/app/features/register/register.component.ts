import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/auth/auth.service';
import { RegisterUser } from 'src/app/core/interfaces/register-user.interface';
import { AppAlertService } from '../../core/services/app-alert.service';
import { ToastrService } from 'ngx-toastr';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { SuccessModalComponent } from './success-modal.component';

@Component({
  selector: 'app-register',
  standalone: true,
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule
  ]
})
export class RegisterComponent implements OnInit {
  valForm!: FormGroup;
  errorMsg: string | null = null;
  successMsg: string | null = null;

  private toastr = inject(ToastrService);
  private dialog = inject(MatDialog);

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router,
    private _appAlertService: AppAlertService
  ) {
    this.createForm();
  }

  ngOnInit(): void {}

  private createForm(): void {
    this.valForm = this.fb.group({
      firstName: [null, [Validators.required, Validators.minLength(2), Validators.maxLength(20)]],
      lastName: [null, [Validators.required]],
      email: [null, [Validators.required, Validators.email]],
      password: [null, [Validators.required, Validators.minLength(6), Validators.maxLength(20)]],
      phoneNumber: [null, [Validators.required, Validators.pattern(/^\d{10}$/)]],
      roleId: ['basic', [Validators.required]]
    });
  }

  submitForm(event: Event, value: RegisterUser): void {
    event.preventDefault();
    Object.values(this.valForm.controls).forEach(control => control.markAsTouched());

    if (!this.valForm.valid) return;

    // Codifica la contraseña a base64 y construye el payload
  const plainPassword = this.valForm.value.password;
  const payload: RegisterUser = {
    ...this.valForm.value,
    password: btoa(plainPassword) // 👈 codifica correctamente la contraseña
  };

    // Llama al servicio de registro
  this.auth.register(payload).subscribe({
    next: () => {
      this.successMsg = '✅ Registro completado exitosamente.';
      this.dialog.open(SuccessModalComponent, {
        data: { message: this.successMsg }
      }).afterClosed().subscribe(() => {
        this.router.navigate(['/login']);
      });
    },
    error: (error) => {
      this.successMsg = null;
      this.errorMsg = error?.error?.message || '❌ Error al registrar. Intenta nuevamente.';
      this.toastr.error(this.errorMsg ?? '❌ Error al registrar. Intenta nuevamente.', 'Error');

      }
    });
  }
}
