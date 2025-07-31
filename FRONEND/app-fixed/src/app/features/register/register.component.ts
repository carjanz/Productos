import { CommonModule } from '@angular/common';
import { Component, inject,OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/auth/auth.service';
import { RegisterUser } from 'src/app/core/interfaces/register-user.interface';
import { AppAlertService } from '../../core/services/app-alert.service';
import { ToastrService } from 'ngx-toastr'; 

@Component({
  standalone: true,
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  imports: [ReactiveFormsModule, CommonModule]
})
export class RegisterComponent implements OnInit {
  valForm!: FormGroup;
  errorMsg: string | null = null;
  successMsg: string | null = null;
  private toastr = inject(ToastrService);

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router,
    private _appAlertService: AppAlertService
  ) {
    this.createForm();
  }

  ngOnInit(): void { }

  // Crear formulario con validaciones
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


  // Envío del formulario
  submitForm(event: Event, value: RegisterUser): void {
    event.preventDefault();

    // Marcar todos los campos como tocados para mostrar validaciones
    Object.values(this.valForm.controls).forEach(control => control.markAsTouched());

    // Verificar si el formulario es válido
    if (!this.valForm.valid) {
      return; // No hacer nada, los errores se muestran en la vista
    }
    // Construir el payload
    const payload: RegisterUser = {
      ...this.valForm.value,
      password: btoa(this.valForm.value.password) // Encriptar con base64
    };

    // Enviar registro
   this.auth.register(payload).subscribe({
  next: () => {
    this.successMsg = '✅ Registro completado. Iniciando sesión...';

    const loginPayload = {
      email: payload.email,
      password: payload.password
    };
      console.log(this.valForm.value.password) 
    console.log(this.valForm) 

      console.log("asi llego") 
    console.log(loginPayload) 

    this.auth.login(loginPayload).subscribe({
      next: (res) => {
        if (res.succeeded && res.data) {
          this.toastr.success('Inicio de sesión exitoso', 'Éxito');
          this.router.navigate(['/dashboard']);
        } else {
          this.toastr.error(res.messages?.[0] || 'Credenciales incorrectas', 'Error');
          //this.router.navigate(['/login']);
        }
      },
      error: (err) => {
        console.log(err);
        this.toastr.error(err.message || 'Error de conexión al servidor', 'Error');
        //this.router.navigate(['/login']);
      }
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
