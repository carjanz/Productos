import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/auth/auth.service';
import { ToastrService, ToastrModule } from 'ngx-toastr';

@Component({
  standalone: true,
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  imports: [CommonModule, ReactiveFormsModule, ToastrModule]
})
export class LoginComponent implements OnInit {
  form!: FormGroup;

  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);
  private toastr = inject(ToastrService);

  ngOnInit(): void {
    this.form = this.fb.group({
      email: ['admin@email.com', [Validators.required, Validators.email]],
      password: ['Password123!', [Validators.required]]
    });
  }

  submit(): void {
  if (this.form.invalid) {
    this.toastr.error('Completa los campos requeridos correctamente', 'Formulario inválido');
    return;
  }

  const formValue = this.form.value;
  const payload = {
    email: formValue.email,
    password: btoa(formValue.password) // 👈 codifica la contraseña
  };

  console.log('📤 Enviando datos de login:', payload);

  this.auth.login(payload).subscribe({
    next: (res) => {
      console.log('✅ Respuesta de login:', res);
      if (res.succeeded && res.data) {
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('refreshToken', res.data.refreshToken);
        this.toastr.success('Inicio de sesión exitoso', 'Éxito');
        this.router.navigate(['/dashboard']);
      } else {
        this.toastr.error(res.messages?.[0] || 'Credenciales incorrectas', 'Error de autenticación');
      }
    },
    error: (err) => {
      console.error('❌ Error durante login:', err);
      this.toastr.error(err.message || 'Error de conexión al servidor', 'Error');
    }
  });
  }
}
