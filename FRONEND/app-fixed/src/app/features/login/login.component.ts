import { Component,inject  } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators,ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/auth/auth.service';
import { ToastrService, ToastrModule } from 'ngx-toastr';

@Component({
  standalone: true,
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  imports: [CommonModule, ReactiveFormsModule,ToastrModule]
})
export class LoginComponent {
  form: FormGroup;

  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);
  private toastr = inject(ToastrService); // 👈 inyecta el servicio

  constructor() {
    this.form = this.fb.group({
      email: [''],
      password: ['']
    });
  }



   ngOnInit(): void {
    this.initForm();
  }


 private initForm(): void {
    this.form = this.fb.group({
      email: ['admin@email.com', [Validators.required, Validators.email]],
      password: ['Password123!', Validators.required]
    });
  }

submit() {
  this.auth.login(this.form.value).subscribe({
    next: (res) => {
      if (res.succeeded && res.data) {
        // Redirige al dashboard y pasa el mensaje por navigation state
               this.toastr.success('Inicio de sesión exitoso', 'Éxito'); // ✅ toast
          this.router.navigate(['/dashboard']);
      } else {
      this.toastr.error(res.messages?.[0] || 'Credenciales incorrectas', 'Error'); // ✅ toast
      }
    },
    error: (err) => {
        this.toastr.error(err.message || 'Error de conexión al servidor', 'Error');
    }
  });
}




}
